import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { productService } from '../services/api';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';

const ITEMS_PER_PAGE = 12;

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params state
  const querySearch = searchParams.get('search') || searchParams.get('q') || '';
  const queryCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(queryCategory);
  const [searchQuery, setSearchQuery] = useState(querySearch);
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync state when URL search params change
  useEffect(() => {
    setSelectedCategory(queryCategory);
    setSearchQuery(querySearch);
    setCurrentPage(1);
  }, [queryCategory, querySearch]);

  // Load Categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await productService.getCategories();
        setCategories(res.categories || res || []);
      } catch (e) {
        console.warn('Could not load categories:', e);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products whenever filters change
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const skip = (currentPage - 1) * ITEMS_PER_PAGE;
      const res = await productService.getProducts({
        limit: ITEMS_PER_PAGE,
        skip,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery || undefined,
        sortBy: sortBy || undefined,
        order: order || undefined
      });

      let fetched = res.products || [];

      // Apply client-side price filter if user adjusted slider
      if (priceRange[1] < 2000) {
        fetched = fetched.filter((p) => p.price <= priceRange[1]);
      }

      setProducts(fetched);
      setTotalProducts(res.total || fetched.length);
    } catch (err) {
      console.error('Error fetching catalog products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, searchQuery, sortBy, order, priceRange]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (cat === 'all') {
        updated.delete('category');
      } else {
        updated.set('category', cat);
      }
      return updated;
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (searchQuery.trim()) {
        updated.set('search', searchQuery.trim());
      } else {
        updated.delete('search');
      }
      return updated;
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('');
    setOrder('asc');
    setPriceRange([0, 2000]);
    setCurrentPage(1);
    setSearchParams({});
  };

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE) || 1;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight">
            Product Catalog
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            {selectedCategory !== 'all' ? (
              <span>Category: <strong className="text-primary capitalize">{selectedCategory.replace('-', ' ')}</strong> • </span>
            ) : null}
            Found <strong>{totalProducts}</strong> products
          </p>
        </div>

        {/* Search in page */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog..."
              className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary-container"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchParams((prev) => {
                    const u = new URLSearchParams(prev);
                    u.delete('search');
                    return u;
                  });
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-secondary p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-container text-on-primary text-xs font-bold rounded-xl hover:bg-primary transition-all shrink-0"
          >
            Search
          </button>
          
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="lg:hidden p-2 rounded-xl bg-surface-container-high text-on-surface border border-outline-variant/30"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Sidebar Filters (Desktop) */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            sortBy={sortBy}
            order={order}
            onSortChange={(sb, ord) => {
              setSortBy(sb);
              setOrder(ord);
              setCurrentPage(1);
            }}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            totalResults={totalProducts}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end animate-fade-in">
            <div className="w-full max-w-xs bg-surface-container-lowest h-full p-6 overflow-y-auto space-y-4 animate-slide-in-right shadow-elevated">
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="font-bold text-sm">Filter Products</h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  handleCategorySelect(cat);
                  setIsMobileFiltersOpen(false);
                }}
                sortBy={sortBy}
                order={order}
                onSortChange={(sb, ord) => {
                  setSortBy(sb);
                  setOrder(ord);
                  setCurrentPage(1);
                }}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                totalResults={totalProducts}
                onReset={() => {
                  handleResetFilters();
                  setIsMobileFiltersOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Products Grid + Pagination */}
        <div className="lg:col-span-3 space-y-8">
          <ProductGrid
            products={products}
            isLoading={isLoading}
            error={error}
            onRetry={fetchProducts}
            skeletonCount={12}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-outline-variant/30 pt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-outline-variant/40 bg-surface-container-lowest text-on-surface hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 3 + i;
                    if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                  }

                  const isCurrent = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-primary-container text-on-primary shadow-sm'
                          : 'text-secondary hover:bg-surface-container-low'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || isLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-outline-variant/40 bg-surface-container-lowest text-on-surface hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
