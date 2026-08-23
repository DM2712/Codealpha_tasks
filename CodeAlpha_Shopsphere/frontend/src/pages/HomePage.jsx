import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Truck,
  Star,
  Layers,
  ChevronRight
} from 'lucide-react';
import { productService } from '../services/api';
import { ProductGrid } from '../components/product/ProductGrid';

export const HomePage = () => {
  const navigate = useNavigate();
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getProducts({ limit: 8, sortBy: 'rating', order: 'desc' }),
          productService.getCategories()
        ]);

        setTrendingProducts(productsRes.products || []);
        setCategories(categoriesRes.categories || categoriesRes || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
        setError('Could not load trending products. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const featuredCategoryShortcuts = [
    { slug: 'beauty', name: 'Beauty', icon: '💄', color: 'bg-rose-50 text-rose-700' },
    { slug: 'smartphones', name: 'Tech & Gadgets', icon: '📱', color: 'bg-blue-50 text-blue-700' },
    { slug: 'mens-watches', name: 'Luxury Watches', icon: '⌚', color: 'bg-amber-50 text-amber-700' },
    { slug: 'furniture', name: 'Home Living', icon: '🪑', color: 'bg-emerald-50 text-emerald-700' },
    { slug: 'fragrances', name: 'Fragrances', icon: '✨', color: 'bg-purple-50 text-purple-700' },
    { slug: 'womens-bags', name: 'Designer Bags', icon: '👜', color: 'bg-pink-50 text-pink-700' }
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden shadow-card border border-outline-variant/30 bg-surface-container-low min-h-[440px] sm:min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
            alt="Hero Lifestyle"
            className="w-full h-full object-cover object-center filter brightness-[0.65]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl p-6 sm:p-12 text-white space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-container/80 backdrop-blur-md text-on-primary text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Collection 
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
            Elevate Your Everyday Style.
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-lg">
            Discover curated luxury essentials, cutting-edge technology, and artisanal lifestyle pieces designed for modern living.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/products"
              className="px-6 py-3.5 bg-primary-container hover:bg-primary text-on-primary font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95"
            >
              Shop Collection <ArrowRight className="w-4 h-4" />
            </Link>
            {/* <Link
              to="/products?category=beauty"
              className="px-6 py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm rounded-2xl transition-all border border-white/30"
            >
              Explore Beauty
            </Link> */}
          </div>
        </div>
      </section>

      {/* 2. Category Shortcuts Rail */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-on-background tracking-tight">
              Curated Categories
            </h2>
            <p className="text-xs text-secondary">Browse by your favorite departments</p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {featuredCategoryShortcuts.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => navigate(`/products?category=${cat.slug}`)}
              className="group p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary-container/50 shadow-soft hover:shadow-card transition-all flex flex-col items-center text-center space-y-2"
            >
              <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-on-background group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Trending Products Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-on-background tracking-tight">
                Trending Highlights
              </h2>
              <p className="text-xs text-secondary">Top-rated items loved by customers</p>
            </div>
          </div>

          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-1"
          >
            Explore Catalog <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid
          products={trendingProducts}
          isLoading={isLoading}
          error={error}
          onRetry={() => window.location.reload()}
          skeletonCount={8}
        />
      </section>

      {/* 4. Promotional Spotlight Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-primary via-primary-container to-indigo-800 p-8 sm:p-12 text-white shadow-elevated relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white">
            Limited Time Offer
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Special Launch Perks: Up to 20% Off Orders
          </h2>
          <p className="text-sm text-indigo-100 leading-relaxed">
            Apply discount voucher <strong>SHOPSPHERE10</strong> at checkout to redeem an instant 10% discount on all catalog items with zero minimum spend.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-extrabold text-sm rounded-2xl hover:bg-slate-100 transition-all shadow-md active:scale-95"
            >
              Shop Deals Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Customer Testimonials */}
      <section className="space-y-6">
        <div className="text-center max-w-md mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-on-background tracking-tight">
            Loved by Shoppers
          </h2>
          <p className="text-xs text-secondary">Verified buyer ratings and reviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft space-y-3">
            <div className="flex items-center text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              "The checkout was buttery smooth and the order tracking was accurate down to the minute. The product quality exceeded my expectations!"
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary font-bold text-xs flex items-center justify-center">
                SC
              </div>
              <div>
                <p className="text-xs font-bold text-on-background">Sophia Chen</p>
                <p className="text-[10px] text-secondary">Verified Buyer • New York</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft space-y-3">
            <div className="flex items-center text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              "Fast shipping, authentic items, and the interface feels remarkably modern and clean. ShopSphere has become my go-to store."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                MR
              </div>
              <div>
                <p className="text-xs font-bold text-on-background">Marcus Reynolds</p>
                <p className="text-[10px] text-secondary">Verified Buyer • San Francisco</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft space-y-3">
            <div className="flex items-center text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              "Super easy authentication with Clerk and instant receipt confirmations. Love the responsive mobile experience!"
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                EP
              </div>
              <div>
                <p className="text-xs font-bold text-on-background">Emma Patterson</p>
                <p className="text-[10px] text-secondary">Verified Buyer • Austin</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
