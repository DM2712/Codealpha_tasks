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
  AlertCircle
} from 'lucide-react';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { QuantitySelector } from '../components/product/QuantitySelector';
import { ProductGrid } from '../components/product/ProductGrid';
import { Skeleton } from '../components/ui/Skeleton';

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
      <div className="max-w-6xl mx-auto py-8 space-y-8 animate-pulse">
        <div className="h-4 w-48 bg-slate-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-slate-200 rounded-3xl"></div>
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
      <div className="py-20 text-center max-w-md mx-auto p-8 bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
        <AlertCircle className="w-12 h-12 text-error mx-auto mb-3" />
        <h2 className="text-xl font-bold text-on-background mb-2">Product Not Found</h2>
        <p className="text-xs text-secondary mb-6">{error || "The product you're looking for does not exist."}</p>
        <Link
          to="/products"
          className="inline-block px-6 py-2.5 bg-primary-container text-on-primary font-bold text-xs rounded-xl"
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
    <div className="max-w-7xl mx-auto space-y-12 pb-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-secondary">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/products?category=${product.category}`} className="hover:text-primary capitalize transition-colors">
          {product.category?.replace('-', ' ')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-on-surface font-semibold truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* Main Product Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Large Main View */}
          <div className="relative aspect-square w-full rounded-3xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden p-6 sm:p-10 flex items-center justify-center shadow-soft">
            {product.discountPercentage > 5 && (
              <span className="absolute top-4 left-4 z-10 bg-error text-on-error text-xs font-black uppercase px-3 py-1 rounded-lg tracking-wider shadow-sm">
                {Math.round(product.discountPercentage)}% OFF
              </span>
            )}

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-600 shadow-sm'
                  : 'bg-surface-container-low text-secondary hover:text-rose-600'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
            </button>

            <img
              src={selectedImage || product.thumbnail}
              alt={product.title}
              className="max-h-full max-w-full object-contain transition-all duration-300 hover:scale-105"
            />
          </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl bg-surface-container-lowest border-2 overflow-hidden p-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-primary-container shadow-md scale-105'
                      : 'border-outline-variant/30 hover:border-outline-variant'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Purchase Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                {product.brand || product.category?.replace('-', ' ')}
              </span>
              <button
                onClick={handleShare}
                className="p-1.5 rounded-xl text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight">
              {product.title}
            </h1>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-900">
                  {typeof rating === 'number' ? rating.toFixed(1) : rating}
                </span>
              </div>
              <span className="text-xs text-secondary">
                ({product.reviews ? product.reviews.length : 124} customer reviews)
              </span>
              <span className="text-outline">•</span>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                <PackageCheck className="w-3.5 h-3.5" />
                <span>{product.stock ? `${product.stock} in stock` : 'In Stock'}</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-on-background">
                ${product.price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-sm text-outline line-through">
                  ${originalPrice}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Save ${(parseFloat(originalPrice) - product.price).toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-secondary">Taxes included. Free shipping on orders over $50.</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">About the product</h3>
            <p className="text-sm text-secondary leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity & CTA */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-6 bg-primary-container text-on-primary font-bold text-sm rounded-2xl hover:bg-primary active:scale-98 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="py-3.5 px-6 bg-on-background text-white font-bold text-sm rounded-2xl hover:bg-black active:scale-98 transition-all shadow-md text-center"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-outline-variant/30 text-center">
            <div className="p-3 bg-surface-container-low rounded-xl">
              <Truck className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-[11px] font-bold text-on-background">Fast Delivery</p>
              <p className="text-[10px] text-secondary">2-4 business days</p>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl">
              <RotateCcw className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-[11px] font-bold text-on-background">Free Returns</p>
              <p className="text-[10px] text-secondary">30-day window</p>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl">
              <ShieldCheck className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-[11px] font-bold text-on-background">Authentic</p>
              <p className="text-[10px] text-secondary">100% Guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <section className="space-y-4 pt-8 border-t border-outline-variant/30">
          <h2 className="text-xl font-extrabold text-on-background tracking-tight">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.reviews.map((rev, i) => (
              <div key={i} className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-background">{rev.reviewerName}</span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
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
        <section className="space-y-4 pt-8 border-t border-outline-variant/30">
          <h2 className="text-xl font-extrabold text-on-background tracking-tight">Related Items</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
};
