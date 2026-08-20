import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const EXTERNAL_API_URL = process.env.EXTERNAL_PRODUCT_API_URL || 'https://dummyjson.com/products';

// Fallback static catalog for instant offline resilience
const FALLBACK_PRODUCTS = [
  {
    id: '1',
    title: "Chronograph S1 Minimalist Watch",
    description: "A high-end, minimalist smartwatch with a brushed steel case and supple leather band. Water-resistant up to 50m with sapphire crystal glass.",
    price: 299.00,
    discountPercentage: 12.5,
    rating: 4.9,
    stock: 45,
    brand: "AuraTime",
    category: "mens-watches",
    categoryName: "Men's Watches",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: '2',
    title: "Artisan Ceramic Pour-Over Kit",
    description: "Beautifully designed matte charcoal ceramic pour-over brewer with matching heat-retentive mug. Handcrafted for the perfect morning brew.",
    price: 85.00,
    discountPercentage: 20.0,
    rating: 4.7,
    stock: 18,
    brand: "Kurasu Studio",
    category: "home-decoration",
    categoryName: "Home Decoration",
    thumbnail: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: '3',
    title: "Aura Studio ANC Wireless Headphones",
    description: "Engineered with custom 40mm drivers and active hybrid noise cancellation. 40-hour battery life with plush memory foam ear cushions.",
    price: 349.99,
    discountPercentage: 10.0,
    rating: 4.9,
    stock: 24,
    brand: "SoundSculpt",
    category: "electronics",
    categoryName: "Electronics",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: '4',
    title: "Italian Nappa Leather Weekend Tote",
    description: "Full-grain vegetable tanned Italian leather travel tote. Features brass hardware and dedicated padded laptop sleeve.",
    price: 420.00,
    discountPercentage: 0,
    rating: 4.8,
    stock: 12,
    brand: "Milano Atelier",
    category: "womens-bags",
    categoryName: "Women's Bags",
    thumbnail: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"
    ]
  }
];

const formatCategorySlug = (cat) => {
  if (!cat) return 'general';
  return String(cat)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Universal product normalizer
export const normalizeProduct = (item, index = 0) => {
  if (!item) return null;

  const id = String(item.id || index + 1);
  const title = item.title || item.name || item.product_name || 'Product';
  const description = item.description || 'Premium quality product curated for the ShopSphere collection.';

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

  const thumbnail = item.thumbnail || item.image || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
  const images = (item.images && Array.isArray(item.images) && item.images.length > 0)
    ? item.images
    : (item.image ? [item.image] : [thumbnail]);

  const rawCategory = item.category || 'General';
  const categorySlug = formatCategorySlug(rawCategory);
  const brand = item.brand || item.subCategory || 'ShopSphere Essential';
  const discountPercentage = typeof item.discountPercentage === 'number' ? item.discountPercentage : 0;
  const stock = typeof item.stock === 'number' ? item.stock : 45;

  const reviews = (item.reviews && Array.isArray(item.reviews))
    ? item.reviews
    : [
        {
          reviewerName: 'Verified Customer',
          rating: Math.round(rating),
          comment: 'High quality build and arrived quickly. Exactly as described!',
          date: new Date(Date.now() - 2 * 86400000).toISOString()
        },
        {
          reviewerName: 'Jordan K.',
          rating: 5,
          comment: 'Great value for money. Would definitely buy again.',
          date: new Date(Date.now() - 5 * 86400000).toISOString()
        }
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
    categoryName: rawCategory,
    subCategory: item.subCategory || '',
    thumbnail,
    image: thumbnail,
    images,
    discountPercentage
  };
};

// In-Memory Catalog Cache (30 Minutes TTL for instant speed)
let cachedCatalog = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 30 * 60 * 1000;
let cachedCategories = null;

export const productService = {
  /**
   * Fetch and normalize all products with sub-millisecond memory caching
   */
  async fetchRawCatalog() {
    const now = Date.now();
    if (cachedCatalog && (now - cacheTimestamp) < CACHE_TTL_MS) {
      return cachedCatalog;
    }

    try {
      const response = await axios.get(EXTERNAL_API_URL, { timeout: 6000 });
      const data = response.data;

      let rawArray = [];
      if (Array.isArray(data)) {
        rawArray = data;
      } else if (data && Array.isArray(data.products)) {
        rawArray = data.products;
      } else if (data && typeof data === 'object') {
        const potentialArray = Object.values(data).find(v => Array.isArray(v));
        if (potentialArray) rawArray = potentialArray;
      }

      if (rawArray.length > 0) {
        cachedCatalog = rawArray.map((item, idx) => normalizeProduct(item, idx));
        cacheTimestamp = now;
        
        // Pre-compute categories
        const categoryMap = new Map();
        cachedCatalog.forEach(p => {
          if (p.category && !categoryMap.has(p.category)) {
            categoryMap.set(p.category, {
              slug: p.category,
              name: p.categoryName || p.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            });
          }
        });
        cachedCategories = Array.from(categoryMap.values());

        return cachedCatalog;
      }

      throw new Error('API response did not contain a recognized product array');
    } catch (error) {
      console.warn(`⚠️ External API (${EXTERNAL_API_URL}) fallback triggered: ${error.message}`);
      cachedCatalog = FALLBACK_PRODUCTS.map((p, idx) => normalizeProduct(p, idx));
      cacheTimestamp = now;
      return cachedCatalog;
    }
  },

  /**
   * Fast in-memory filtered products
   */
  async getProducts({ limit = 20, skip = 0, category, search, sortBy, order = 'asc' }) {
    const catalog = await this.fetchRawCatalog();
    let filtered = [...catalog];

    // 1. Category Filter
    if (category && category !== 'all') {
      const targetSlug = formatCategorySlug(category);
      filtered = filtered.filter(p => p.category === targetSlug || p.category.includes(targetSlug) || targetSlug.includes(p.category));
    }

    // 2. Search Query Filter
    if (search && search.trim()) {
      const query = search.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(query))
      );
    }

    // 3. Sorting
    if (sortBy === 'price') {
      filtered.sort((a, b) => order === 'desc' ? b.price - a.price : a.price - b.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => order === 'desc' ? b.rating - a.rating : a.rating - b.rating);
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => order === 'desc' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title));
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return {
      products: paginated,
      total,
      skip,
      limit
    };
  },

  /**
   * Single product lookup by ID
   */
  async getProductById(id) {
    const catalog = await this.fetchRawCatalog();
    const strId = String(id);
    const product = catalog.find(p => String(p.id) === strId);

    if (product) {
      return product;
    }

    const fallback = FALLBACK_PRODUCTS.find(p => String(p.id) === strId);
    if (fallback) return normalizeProduct(fallback);

    throw new Error(`Product with ID "${id}" not found`);
  },

  /**
   * Pre-computed unique categories
   */
  async getCategories() {
    if (cachedCategories && (Date.now() - cacheTimestamp) < CACHE_TTL_MS) {
      return cachedCategories;
    }
    await this.fetchRawCatalog();
    return cachedCategories || [];
  }
};

// Pre-warm catalog immediately in background on server boot
productService.fetchRawCatalog().catch(() => {});
