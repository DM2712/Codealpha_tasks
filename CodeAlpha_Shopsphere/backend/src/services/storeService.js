import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import crypto from 'crypto';

// In-Memory fallback store for demo & zero-config testing
const memoryStore = {
  users: new Map(),
  orders: new Map(),
  orderItems: new Map(),
};

// Seed sample orders for demo
const seedDemoOrders = () => {
  const demoOrderId = 'ord_demo_982341';
  const demoClerkId = 'user_demo_codealpha';
  
  memoryStore.orders.set(demoOrderId, {
    id: demoOrderId,
    clerk_user_id: demoClerkId,
    total_amount: 324.98,
    subtotal: 299.99,
    tax: 24.99,
    shipping_fee: 0.00,
    discount: 0.00,
    status: 'delivered',
    payment_method: 'credit_card',
    shipping_details: {
      fullName: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
      country: 'United States',
      phone: '+1 (555) 019-2834'
    },
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  });

  memoryStore.orderItems.set(demoOrderId, [
    {
      id: 'item_demo_1',
      order_id: demoOrderId,
      product_id: '1',
      product_name: 'Essence Mascara Lash Princess',
      price: 9.99,
      quantity: 1,
      image_url: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png',
      created_at: new Date().toISOString()
    },
    {
      id: 'item_demo_2',
      order_id: demoOrderId,
      product_id: '2',
      product_name: 'Eyeshadow Palette with Mirror',
      price: 19.99,
      quantity: 2,
      image_url: 'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png',
      created_at: new Date().toISOString()
    }
  ]);
};

seedDemoOrders();

export const storeService = {
  // ---------------------------------------------------------------------------
  // User Profiles
  // ---------------------------------------------------------------------------
  async upsertUserProfile(userData) {
    const { clerk_user_id, name, email, phone, avatar_url } = userData;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .upsert(
            {
              clerk_user_id,
              name,
              email,
              phone,
              avatar_url,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'clerk_user_id' }
          )
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase upsertUserProfile error, falling back to memory store:', err.message);
      }
    }

    const existing = memoryStore.users.get(clerk_user_id) || {};
    const updated = {
      id: existing.id || crypto.randomUUID(),
      clerk_user_id,
      name: name || existing.name || 'Shopper',
      email: email || existing.email || '',
      phone: phone || existing.phone || '',
      avatar_url: avatar_url || existing.avatar_url || '',
      created_at: existing.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memoryStore.users.set(clerk_user_id, updated);
    return updated;
  },

  async getUserProfile(clerk_user_id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('clerk_user_id', clerk_user_id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        if (data) return data;
      } catch (err) {
        console.error('Supabase getUserProfile error:', err.message);
      }
    }

    return memoryStore.users.get(clerk_user_id) || null;
  },

  // ---------------------------------------------------------------------------
  // Orders
  // ---------------------------------------------------------------------------
  async createOrder({ clerk_user_id, total_amount, subtotal, tax, shipping_fee, discount, payment_method, shipping_details, items }) {
    const orderId = isSupabaseConfigured ? undefined : `ord_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

    if (isSupabaseConfigured && supabase) {
      try {
        // 1. Insert order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            clerk_user_id,
            total_amount: parseFloat(total_amount),
            subtotal: parseFloat(subtotal || total_amount),
            tax: parseFloat(tax || 0),
            shipping_fee: parseFloat(shipping_fee || 0),
            discount: parseFloat(discount || 0),
            status: 'processing',
            payment_method: payment_method || 'credit_card',
            shipping_details
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // 2. Insert order items
        const formattedItems = items.map((item) => ({
          order_id: orderData.id,
          product_id: String(item.product_id || item.id),
          product_name: item.product_name || item.title || 'Product',
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity, 10),
          image_url: item.image_url || item.thumbnail || (item.images && item.images[0]) || ''
        }));

        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .insert(formattedItems)
          .select();

        if (itemsError) throw itemsError;

        return {
          ...orderData,
          items: itemsData
        };
      } catch (err) {
        console.error('Supabase createOrder error, falling back to memory store:', err.message);
      }
    }

    // Memory Store Implementation
    const newOrderId = orderId || `ord_${Date.now().toString(36)}`;
    const newOrder = {
      id: newOrderId,
      clerk_user_id,
      total_amount: parseFloat(total_amount),
      subtotal: parseFloat(subtotal || total_amount),
      tax: parseFloat(tax || 0),
      shipping_fee: parseFloat(shipping_fee || 0),
      discount: parseFloat(discount || 0),
      status: 'processing',
      payment_method: payment_method || 'credit_card',
      shipping_details,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const newItems = items.map((item) => ({
      id: `item_${crypto.randomUUID()}`,
      order_id: newOrderId,
      product_id: String(item.product_id || item.id),
      product_name: item.product_name || item.title || 'Product',
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity, 10),
      image_url: item.image_url || item.thumbnail || (item.images && item.images[0]) || '',
      created_at: new Date().toISOString()
    }));

    memoryStore.orders.set(newOrderId, newOrder);
    memoryStore.orderItems.set(newOrderId, newItems);

    return {
      ...newOrder,
      items: newItems
    };
  },

  async getOrdersByUser(clerk_user_id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: orders, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .eq('clerk_user_id', clerk_user_id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        return orders.map(order => ({
          ...order,
          items: order.order_items || []
        }));
      } catch (err) {
        console.error('Supabase getOrdersByUser error, reading memory store:', err.message);
      }
    }

    // Memory store lookup
    const userOrders = [];
    for (const order of memoryStore.orders.values()) {
      if (order.clerk_user_id === clerk_user_id || clerk_user_id === 'guest' || clerk_user_id === 'user_demo_codealpha') {
        const items = memoryStore.orderItems.get(order.id) || [];
        userOrders.push({
          ...order,
          items
        });
      }
    }

    return userOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getOrderById(order_id, clerk_user_id) {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .eq('id', order_id);

        if (clerk_user_id && clerk_user_id !== 'admin') {
          query = query.eq('clerk_user_id', clerk_user_id);
        }

        const { data, error } = await query.single();
        if (error) throw error;
        
        return {
          ...data,
          items: data.order_items || []
        };
      } catch (err) {
        console.error('Supabase getOrderById error:', err.message);
      }
    }

    const order = memoryStore.orders.get(order_id);
    if (!order) return null;

    if (clerk_user_id && clerk_user_id !== 'admin' && order.clerk_user_id !== clerk_user_id) {
      return null;
    }

    return {
      ...order,
      items: memoryStore.orderItems.get(order_id) || []
    };
  },

  async getAllOrders() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: orders, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return orders.map(order => ({ ...order, items: order.order_items || [] }));
      } catch (err) {
        console.error('Supabase getAllOrders error:', err.message);
      }
    }

    const allOrders = [];
    for (const order of memoryStore.orders.values()) {
      allOrders.push({
        ...order,
        items: memoryStore.orderItems.get(order.id) || []
      });
    }
    return allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async updateOrderStatus(order_id, status) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', order_id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase updateOrderStatus error:', err.message);
      }
    }

    const order = memoryStore.orders.get(order_id);
    if (order) {
      order.status = status;
      order.updated_at = new Date().toISOString();
      memoryStore.orders.set(order_id, order);
      return order;
    }
    return null;
  }
};
