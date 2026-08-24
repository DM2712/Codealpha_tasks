import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Heart,
  Share2,
  ChevronRight,
  PackageCheck,
  AlertCircle,
  Zap,
  Check
} from 'lucide-react';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { QuantitySelector } from '../components/product/QuantitySelector';
import { ProductGrid } from '../components/product/ProductGrid';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setQuantity(1);

        const res = await productService.getProductById(id);
        const prod = res.product || res;
        setProduct(prod);

        const firstImage = prod.thumbnail || (prod.images && prod.images[0]) || '';
        setSelectedImage(firstImage);

        // Fetch related products in the same category
        if (prod.category) {
          try {
            const relRes = await productService.getProducts({ category: prod.category, limit: 4 });
            setRelatedProducts((relRes.products || []).filter((p) => String(p.id) !== String(prod.id)));
          } catch (e) {
            console.warn('Could not fetch related products:', e);
          }
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
        setError('Product not found or unavailable');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-6 sm:py-8 space-y-6 sm:space-y-8 animate-pulse">
        <div className="h-4 w-40 bg-slate-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="aspect-square bg-slate-200 rounded-2xl sm:rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-slate-200 rounded"></div>
            <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
            <div className="h-24 w-full bg-slate-200 rounded"></div>
            <div className="h-12 w-full bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-16 sm:py-20 text-center max-w-md mx-auto p-6 sm:p-8 bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
        <AlertCircle className="w-12 h-12 text-error mx-auto mb-3" />
        <h2 className="text-xl font-bold text-on-background mb-2">Product Not Found</h2>
        <p className="text-xs text-secondary mb-6">{error || "The product you're looking for does not exist."}</p>
        <Link
          to="/products"
          className="inline-block px-6 py-2.5 bg-primary-container text-on-primary font-bold text-xs rounded-xl hover:bg-primary transition-all"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const rating = product.rating || 4.5;
  const originalPrice = product.discountPercentage
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;
  const allImages = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 pb-28 lg:pb-16 px-1 sm:px-0">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-secondary overflow-x-auto hide-scrollbar py-1">
        <Link to="/" className="hover:text-primary transition-colors shrink-0">Home</Link>
        <ChevronRight className="w-3 h-3 text-outline shrink-0" />
        <Link to="/products" className="hover:text-primary transition-colors shrink-0">Products</Link>
        <ChevronRight className="w-3 h-3 text-outline shrink-0" />
        <Link to={`/products?category=${product.category}`} className="hover:text-primary capitalize transition-colors shrink-0">
          {product.category?.replace('-', ' ')}
        </Link>
        <ChevronRight className="w-3 h-3 text-outline shrink-0" />
        <span className="text-on-surface font-semibold truncate max-w-[140px] sm:max-w-[220px]">{product.title}</span>
      </nav>

      {/* Main Product Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
        
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          {/* Large Main View */}
          <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden p-4 sm:p-10 flex items-center justify-center shadow-soft">
            {product.discountPercentage > 5 && (
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 bg-error text-on-error text-[10px] sm:text-xs font-black uppercase px-2.5 sm:px-3 py-1 rounded-full tracking-wider shadow-sm">
                {Math.round(product.discountPercentage)}% OFF
              </span>
            )}

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-600 shadow-sm'
                  : 'bg-surface-container-low/90 text-secondary hover:text-rose-600'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
            </button>

            <img
              src={selectedImage || product.thumbnail}
              alt={product.title}
              className="max-h-full max-w-full object-contain transition-all duration-300 hover:scale-105"
            />
          </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar pb-1 pt-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-surface-container-lowest border-2 overflow-hidden p-1.5 sm:p-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-primary-container shadow-md scale-105'
                      : 'border-outline-variant/30 hover:border-outline-variant opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Purchase Controls */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                {product.brand || product.category?.replace('-', ' ')}
              </span>
              <button
                onClick={handleShare}
                className="p-2 rounded-xl text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-on-background tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-2 sm:gap-3 pt-1 flex-wrap">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-amber-200/60">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-900">
                  {typeof rating === 'number' ? rating.toFixed(1) : rating}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-secondary">
                ({product.reviews ? product.reviews.length : 124} reviews)
              </span>
              <span className="text-outline hidden sm:inline">•</span>
              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-700">
                <PackageCheck className="w-3.5 h-3.5" />
                <span>{product.stock ? `${product.stock} in stock` : 'In Stock'}</span>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-1">
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-on-background">
                ${product.price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-xs sm:text-sm text-outline line-through">
                  ${originalPrice}
                </span>
              )}
              {product.discountPercentage > 0 && originalPrice && (
                <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                  Save ${(parseFloat(originalPrice) - product.price).toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-secondary">Taxes included. Free shipping on orders over $50.</p>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">About the product</h3>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Desktop Quantity & CTA */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Quantity</label>
              <QuantitySelector
                quantity={quantity}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                onIncrease={() => setQuantity((q) => Math.min(product.stock || 50, q + 1))}
                max={product.stock || 50}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                className={`py-3 sm:py-3.5 px-6 font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-primary-container text-on-primary hover:bg-primary'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                className="py-3 sm:py-3.5 px-6 bg-on-background text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl hover:bg-black active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 text-center"
              >
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" /> Buy Now
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 border-t border-outline-variant/30 text-center">
            <div className="p-2.5 sm:p-3 bg-surface-container-low rounded-xl">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1" />
              <p className="text-[10px] sm:text-[11px] font-bold text-on-background">Fast Delivery</p>
              <p className="text-[9px] sm:text-[10px] text-secondary">2-4 days</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-surface-container-low rounded-xl">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1" />
              <p className="text-[10px] sm:text-[11px] font-bold text-on-background">Free Returns</p>
              <p className="text-[9px] sm:text-[10px] text-secondary">30-day window</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-surface-container-low rounded-xl">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1" />
              <p className="text-[10px] sm:text-[11px] font-bold text-on-background">Authentic</p>
              <p className="text-[9px] sm:text-[10px] text-secondary">100% Quality</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <section className="space-y-4 pt-6 sm:pt-8 border-t border-outline-variant/30">
          <h2 className="text-lg sm:text-xl font-extrabold text-on-background tracking-tight">Customer Reviews</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {product.reviews.map((rev, i) => (
              <div key={i} className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-background">{rev.reviewerName}</span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, s) => (
                      <Star key={s} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-secondary leading-relaxed">"{rev.comment}"</p>
                <p className="text-[10px] text-outline">{new Date(rev.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4 pt-6 sm:pt-8 border-t border-outline-variant/30">
          <h2 className="text-lg sm:text-xl font-extrabold text-on-background tracking-tight">Related Items</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}

      {/* Mobile Persistent Sticky Bottom Action Bar (Stitch Mobile UX) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-outline-variant/30 px-4 py-2.5 shadow-elevated flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-secondary uppercase font-bold tracking-wider">Total</span>
          <span className="text-base font-black text-on-background">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-[230px]">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-2.5 px-3 font-bold text-xs rounded-xl active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-primary-container text-on-primary hover:bg-primary'
            }`}
          >
            {isAdded ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
            <span>{isAdded ? 'Added!' : 'Add to Cart'}</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="py-2.5 px-3.5 bg-on-background text-white font-bold text-xs rounded-xl active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>Buy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
