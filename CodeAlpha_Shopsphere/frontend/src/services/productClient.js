import axios from 'axios';

// ============================================================
// EXTERNAL PRODUCT API — fetched directly from the browser
// No backend required — works on Vercel, Netlify, GitHub Pages
// ============================================================
const EXTERNAL_API_URL =
  import.meta.env.VITE_EXTERNAL_PRODUCT_API_URL ||
  'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json';

// Fallback catalog shown when external API is unreachable
const FALLBACK_PRODUCTS = [
  {
    id: '1',
    title: 'Chronograph S1 Minimalist Watch',
    description: 'A high-end, minimalist smartwatch with a brushed steel case and supple leather band. Water-resistant up to 50m with sapphire crystal glass.',
    price: 299.00,
    discountPercentage: 12.5,
    rating: 4.9,
    stock: 45,
    brand: 'AuraTime',
    category: 'mens-watches',
    categoryName: "Men's Watches",
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
  },
  {
    id: '2',
    title: 'Aura Studio ANC Wireless Headphones',
    description: 'Engineered with custom 40mm drivers and active hybrid noise cancellation. 40-hour battery life with plush memory foam ear cushions.',
    price: 349.99,
    discountPercentage: 10.0,
    rating: 4.9,
    stock: 24,
    brand: 'SoundSculpt',
    category: 'electronics',
    categoryName: 'Electronics',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
  },
  {
    id: '3',
    title: 'Artisan Ceramic Pour-Over Kit',
    description: 'Beautifully designed matte charcoal ceramic pour-over brewer with matching heat-retentive mug. Handcrafted for the perfect morning brew.',
    price: 85.00,
    discountPercentage: 20.0,
    rating: 4.7,
    stock: 18,
    brand: 'Kurasu Studio',
    category: 'home-decoration',
    categoryName: 'Home Decoration',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'],
  },
  {
    id: '4',
    title: 'Italian Nappa Leather Weekend Tote',
    description: 'Full-grain vegetable tanned Italian leather travel tote. Features brass hardware and dedicated padded laptop sleeve.',
    price: 420.00,
    discountPercentage: 0,
    rating: 4.8,
    stock: 12,
    brand: 'Milano Atelier',
    category: 'womens-bags',
    categoryName: "Women's Bags",
    thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'],
  },
  {
    id: '5',
    title: 'Glacier Series Mountain Backpack 35L',
    description: 'Ultralight waterproof hiking backpack with integrated rain cover, hip belt, and hydration bladder sleeve. Perfect for day treks.',
    price: 189.00,
    discountPercentage: 5.0,
    rating: 4.7,
    stock: 32,
    brand: 'TrailMaster',
    category: 'sports-accessories',
    categoryName: 'Sports Accessories',
    thumbnail: 'https://images.unsplash.com/photo-1622560480605-d83c661a9b96?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1622560480605-d83c661a9b96?w=800&auto=format&fit=crop&q=80'],
  },
  {
    id: '6',
    title: 'Rose & Oud Eau de Parfum 100ml',
    description: 'A complex oriental fragrance blending Bulgarian rose, smoky oud, and warm amber base notes. Long-lasting projection up to 12 hours.',
    price: 165.00,
    discountPercentage: 8.0,
    rating: 4.8,
    stock: 40,
    brand: 'Maison Lumière',
    category: 'fragrances',
    categoryName: 'Fragrances',
    thumbnail: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&auto=format&fit=crop&q=80'],
  },
  {
    id: '7',
    title: 'Pro Max Wireless Charging Pad 15W',
    description: 'Qi2-certified multi-device wireless charger supporting 15W fast charge. Works with iPhone 15, Samsung Galaxy S24, and AirPods.',
    price: 49.99,
    discountPercentage: 15.0,
    rating: 4.6,
    stock: 85,
    brand: 'TechNova',
    category: 'smartphones',
    categoryName: 'Smartphones',
    thumbnail: 'https://images.unsplash.com/photo-1609592806596-b80b8b01a47d?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1609592806596-b80b8b01a47d?w=800&auto=format&fit=crop&q=80'],
  },
  {
    id: '8',
    title: 'Midnight Velvet Lipstick Set',
    description: 'Long-lasting matte velvet formula in 6 curated shades. Infused with vitamin E and hyaluronic acid for 8-hour hydration.',
    price: 64.00,
    discountPercentage: 18.0,
    rating: 4.7,
    stock: 60,
    brand: 'LuxeGlow',
    category: 'beauty',
    categoryName: 'Beauty',
    thumbnail: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2176?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1586495777744-4e6232bf2176?w=800&auto=format&fit=crop&q=80'],
  },
];

// ============================================================
// Utility: Normalise any product shape from any external API
// ============================================================
const formatCategorySlug = (cat) => {
  if (!cat) return 'general';
  return String(cat)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const normalizeProduct = (item, index = 0) => {
  if (!item) return null;

  const id = String(item.id || index + 1);
  const title = item.title || item.name || item.product_name || 'Product';
  const description =
    item.description || 'Premium quality product curated for the ShopSphere collection.';

  let price = 19.99;
  if (typeof item.priceCents === 'number') {
    price = parseFloat((item.priceCents / 100).toFixed(2));
  } else if (item.price !== undefined && item.price !== null) {
    price = parseFloat(Number(item.price).toFixed(2));
  }

  let rating = 4.5;
  let reviewCount = 50;
  if (typeof item.rating === 'object' && item.rating !== null) {
    rating = parseFloat(item.rating.stars || item.rating.rate || 4.5);
    reviewCount = parseInt(item.rating.count, 10) || 50;
  } else if (typeof item.rating === 'number') {
    rating = parseFloat(item.rating);
  }

  const thumbnail =
    item.thumbnail ||
    item.image ||
    (item.images && item.images[0]) ||
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

  const images =
    item.images && Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : item.image
      ? [item.image]
      : [thumbnail];

  const rawCategory = item.category || 'General';
  const categorySlug = formatCategorySlug(rawCategory);
  const brand = item.brand || item.subCategory || 'ShopSphere Essential';
  const discountPercentage =
    typeof item.discountPercentage === 'number' ? item.discountPercentage : 0;
  const stock = typeof item.stock === 'number' ? item.stock : 45;

  const reviews =
    item.reviews && Array.isArray(item.reviews)
      ? item.reviews
      : [
          {
            reviewerName: 'Verified Customer',
            rating: Math.round(rating),
            comment: 'High quality build and arrived quickly. Exactly as described!',
            date: new Date(Date.now() - 2 * 86400000).toISOString(),
          },
          {
            reviewerName: 'Jordan K.',
            rating: 5,
            comment: 'Great value for money. Would definitely buy again.',
            date: new Date(Date.now() - 5 * 86400000).toISOString(),
          },
        ];

  return {
    id,
    title,
    name: title,
    description,
    price,
    rating,
    reviewCount,
    reviews,
    stock,
    brand,
    category: categorySlug,
    categoryName:
      item.categoryName ||
      rawCategory
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()),
    subCategory: item.subCategory || '',
    thumbnail,
    image: thumbnail,
    images,
    discountPercentage,
  };
};

// ============================================================
// In-memory catalog cache (30 min TTL)
// ============================================================
let _catalog = null;
let _cacheTime = 0;
let _categories = null;
const CACHE_TTL = 30 * 60 * 1000;

const fetchCatalog = async () => {
  const now = Date.now();
  if (_catalog && now - _cacheTime < CACHE_TTL) return _catalog;

  try {
    const res = await axios.get(EXTERNAL_API_URL, { timeout: 8000 });
    const data = res.data;

    let raw = [];
    if (Array.isArray(data)) {
      raw = data;
    } else if (data && Array.isArray(data.products)) {
      raw = data.products;
    } else if (data && typeof data === 'object') {
      const found = Object.values(data).find((v) => Array.isArray(v));
      if (found) raw = found;
    }

    if (raw.length > 0) {
      _catalog = raw.map((item, idx) => normalizeProduct(item, idx));
      _cacheTime = now;

      const catMap = new Map();
      _catalog.forEach((p) => {
        if (p.category && !catMap.has(p.category)) {
          catMap.set(p.category, { slug: p.category, name: p.categoryName });
        }
      });
      _categories = Array.from(catMap.values());

      return _catalog;
    }

    throw new Error('Empty product array from external API');
  } catch (err) {
    console.warn('[productService] External API unavailable, using fallback:', err.message);
    _catalog = FALLBACK_PRODUCTS.map((p, i) => normalizeProduct(p, i));
    _cacheTime = now;
    _categories = [...new Map(_catalog.map((p) => [p.category, { slug: p.category, name: p.categoryName }])).values()];
    return _catalog;
  }
};

// ============================================================
// Public Product Service — same interface as before
// ============================================================
export const clientProductService = {
  async getProducts({ limit = 20, skip = 0, category, search, sortBy, order = 'asc' } = {}) {
    const catalog = await fetchCatalog();
    let filtered = [...catalog];

    if (category && category !== 'all') {
      const slug = formatCategorySlug(category);
      filtered = filtered.filter(
        (p) =>
          p.category === slug ||
          p.category.includes(slug) ||
          slug.includes(p.category)
      );
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price') {
      filtered.sort((a, b) =>
        order === 'desc' ? b.price - a.price : a.price - b.price
      );
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) =>
        order === 'desc' ? b.rating - a.rating : a.rating - b.rating
      );
    } else if (sortBy === 'title') {
      filtered.sort((a, b) =>
        order === 'desc'
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title)
      );
    }

    const total = filtered.length;
    return {
      products: filtered.slice(skip, skip + limit),
      total,
      skip,
      limit,
    };
  },

  async getProductById(id) {
    const catalog = await fetchCatalog();
    const product = catalog.find((p) => String(p.id) === String(id));
    if (product) return product;
    const fallback = FALLBACK_PRODUCTS.find((p) => String(p.id) === String(id));
    if (fallback) return normalizeProduct(fallback);
    throw new Error(`Product with ID "${id}" not found`);
  },

  async getCategories() {
    const now = Date.now();
    if (_categories && now - _cacheTime < CACHE_TTL) return _categories;
    await fetchCatalog();
    return _categories || [];
  },
};

// Pre-warm catalog on module import (non-blocking)
fetchCatalog().catch(() => {});
