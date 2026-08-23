import { storeService } from '../services/storeService.js';

export const orderController = {
  // POST /api/orders
  async createOrder(req, res) {
    try {
      const clerk_user_id = req.auth?.userId || req.body.clerk_user_id || 'guest_user';
      const {
        items,
        total_amount,
        subtotal,
        tax,
        shipping_fee,
        discount,
        payment_method,
        shipping_details
      } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Order must contain at least one item'
        });
      }

      if (!shipping_details || !shipping_details.fullName || !shipping_details.address) {
        return res.status(400).json({
          success: false,
          message: 'Valid shipping details (name and address) are required'
        });
      }

      const order = await storeService.createOrder({
        clerk_user_id,
        items,
        total_amount: parseFloat(total_amount),
        subtotal: parseFloat(subtotal || total_amount),
        tax: parseFloat(tax || 0),
        shipping_fee: parseFloat(shipping_fee || 0),
        discount: parseFloat(discount || 0),
        payment_method: payment_method || 'credit_card',
        shipping_details
      });

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order
      });
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create order',
        error: error.message
      });
    }
  },

  // GET /api/orders/my-orders
  async getMyOrders(req, res) {
    try {
      const clerk_user_id = req.auth?.userId || req.query.clerk_user_id || 'guest';
      const orders = await storeService.getOrdersByUser(clerk_user_id);

      return res.status(200).json({
        success: true,
        count: orders.length,
        orders
      });
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve orders',
        error: error.message
      });
    }
  },

  // GET /api/orders/:id
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const clerk_user_id = req.auth?.userId;

      const order = await storeService.getOrderById(id, clerk_user_id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or unauthorized'
        });
      }

      return res.status(200).json({
        success: true,
        order
      });
    } catch (error) {
      console.error(`Error fetching order ${req.params.id}:`, error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve order',
        error: error.message
      });
    }
  },

  // GET /api/orders/admin/all
  async getAllOrders(req, res) {
    try {
      const orders = await storeService.getAllOrders();
      return res.status(200).json({
        success: true,
        count: orders.length,
        orders
      });
    } catch (error) {
      console.error('Error fetching all orders for admin:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve orders',
        error: error.message
      });
    }
  },

  // PATCH /api/orders/:id/status
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const updated = await storeService.updateOrderStatus(id, status);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        order: updated
      });
    } catch (error) {
      console.error(`Error updating order ${req.params.id}:`, error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update order status',
        error: error.message
      });
    }
  }
};
