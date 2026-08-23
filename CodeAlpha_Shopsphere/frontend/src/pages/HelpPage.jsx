import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle, Search, MessageSquare, Package, RotateCcw, Shield,
  ShoppingBag, CreditCard, Truck, User, ChevronDown, ChevronRight,
  ArrowLeft, CheckCircle, Mail, Clock
} from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3.5 flex justify-between items-center bg-transparent hover:bg-surface-container-low/40 transition-colors"
      >
        <span className="text-sm font-semibold text-on-surface pr-4">{question}</span>
        {open
          ? <ChevronDown className="w-4 h-4 text-primary shrink-0" />
          : <ChevronRight className="w-4 h-4 text-secondary shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-outline-variant/10 bg-surface-container-low/20">
          <p className="text-sm text-secondary leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

const categories = [
  { id: 'all', label: 'All Topics', icon: HelpCircle },
  { id: 'orders', label: 'Orders & Shipping', icon: Package },
  { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
  { id: 'payments', label: 'Payments & Billing', icon: CreditCard },
  { id: 'account', label: 'My Account', icon: User },
  { id: 'security', label: 'Security & Privacy', icon: Shield },
];

const faqs = [
  {
    category: 'orders',
    question: 'How do I track my order?',
    answer: 'Once your order ships, you will receive a tracking email with a link to the courier\'s tracking page. You can also view real-time order status by going to My Orders in your account and clicking on any order.',
  },
  {
    category: 'orders',
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 3–7 business days within India. Express delivery (1–2 business days) is available at checkout for an additional fee. International orders typically take 7–14 business days depending on the destination country.',
  },
  {
    category: 'orders',
    question: 'Can I modify or cancel my order after placing it?',
    answer: 'Orders can be cancelled or modified within 1 hour of placement. After that, the order enters fulfilment and cannot be changed. If you miss the window, simply initiate a return once the item is delivered.',
  },
  {
    category: 'orders',
    question: 'Is free shipping available?',
    answer: 'Yes! All orders above ₹5,000 (or $50) qualify for free standard shipping. Smaller orders can add more items or pay a flat shipping fee calculated at checkout.',
  },
  {
    category: 'returns',
    question: 'What is ShopSphere\'s return policy?',
    answer: 'We offer a 7-day, no-questions-asked return policy from the date of delivery. Items must be unused, in original packaging with tags attached. Eligible returns receive a 100% full refund to the original payment method.',
  },
  {
    category: 'returns',
    question: 'How do I start a return?',
    answer: 'Go to My Orders, select the order, and click "Return Item". Choose the reason, and we\'ll email you a pre-paid return shipping label within 30 minutes. Pack the item and drop it at any listed courier point.',
  },
  {
    category: 'returns',
    question: 'When will my refund appear in my account?',
    answer: 'Once we receive and inspect the returned item (1–3 business days), the refund is initiated within 1–2 business days. Funds typically appear in your account within 3–5 business days depending on your bank.',
  },
  {
    category: 'returns',
    question: 'What items cannot be returned?',
    answer: 'Opened beauty and fragrance products, swimwear and intimate apparel, digital downloads, final-sale items marked "Non-Returnable", and gift cards are not eligible for return. See our full Returns Policy for details.',
  },
  {
    category: 'payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, Mastercard, Amex, Rupay), UPI, net banking, wallets (Paytm, PhonePe, GPay), and cash-on-delivery for eligible pin codes.',
  },
  {
    category: 'payments',
    question: 'Is my payment information secure?',
    answer: 'Yes. All card transactions are processed by Stripe (PCI-DSS Level 1 certified). ShopSphere never sees or stores your raw card numbers — only a secure tokenised reference is stored.',
  },
  {
    category: 'payments',
    question: 'Can I use a discount code and store credit together?',
    answer: 'You can apply one discount code at checkout. Store credit (from refunds or promotions) is applied automatically before the discount code, reducing the total further. Both can be active in the same transaction.',
  },
  {
    category: 'account',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login screen and enter your registered email address. You\'ll receive a password reset link within a few minutes. The link expires after 15 minutes for security.',
  },
  {
    category: 'account',
    question: 'How do I update my shipping address?',
    answer: 'You can manage saved addresses from the Profile page under the "Saved Addresses" section. You can add, edit, or delete any address. Note: addresses cannot be changed on orders that have already shipped.',
  },
  {
    category: 'security',
    question: 'Is my personal data shared with third parties?',
    answer: 'No. ShopSphere does not sell, rent, or trade your personal data to third-party advertisers. Data is shared only with essential service providers (payment processor, shipping courier) under strict data processing agreements.',
  },
  {
    category: 'security',
    question: 'How can I delete my account?',
    answer: 'You can request account and data deletion by visiting your Profile page and clicking "Delete Account", or by emailing privacy@shopsphere.io. Account deletion is permanent and all associated data is removed within 30 days.',
  },
];

export const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', category: 'general', subject: '', message: '', orderId: '' });

  const filtered = faqs.filter(faq => {
    const matchCat = activeCat === 'all' || faq.category === activeCat;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); setSubmitted(true); };

  return (
    <div className="min-h-screen">
      {/* Hero / Search Header */}
      <div className="rounded-3xl bg-gradient-to-br from-primary-fixed/30 to-surface-container-low/50 border border-outline-variant/20 p-8 md:p-12 mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary shadow-md">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-background">Help Center</h1>
        </div>
        <p className="text-sm text-secondary max-w-lg mx-auto mb-6">
          Find answers fast, start a return, track your order, or reach our customer support team directly.
        </p>
        {/* Search */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            type="text"
            placeholder="Search for help... e.g. 'track order', 'refund'"
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest text-sm text-on-surface placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-soft"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { icon: <Package className="w-5 h-5" />, label: 'Track My Order', to: '/orders', color: 'bg-blue-100 text-blue-700' },
          { icon: <RotateCcw className="w-5 h-5" />, label: '7-Day Return Policy', to: '/return-policy', color: 'bg-emerald-100 text-emerald-700' },
          { icon: <Shield className="w-5 h-5" />, label: 'Privacy Policy', to: '/privacy-policy', color: 'bg-indigo-100 text-indigo-700' },
          { icon: <Mail className="w-5 h-5" />, label: 'Email Support', to: 'mailto:support@shopsphere.io', color: 'bg-purple-100 text-purple-700' },
        ].map(({ icon, label, to, color }) => (
          <Link key={label} to={to}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all text-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
            <span className="text-xs font-semibold text-on-surface">{label}</span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Category Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-outline-variant/20 bg-surface-container-low/30 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface mb-3">Browse by Topic</p>
            <div className="flex flex-col gap-1">
              {categories.map(({ id, label, icon: Icon }) => (
                <button key={id}
                  onClick={() => { setActiveCat(id); setSearchQuery(''); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                    activeCat === id
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
                  }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* FAQ List */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-bold text-on-background">Frequently Asked Questions</h2>
              <span className="text-xs bg-surface-container text-secondary border border-outline-variant/20 px-2.5 py-1 rounded-full font-mono">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filtered.length > 0 ? (
              <div className="flex flex-col gap-2">
                {filtered.map((faq, i) => (
                  <FAQItem key={i} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-2xl border border-outline-variant/20 bg-surface-container-low/20">
                <HelpCircle className="w-10 h-10 text-secondary/40 mx-auto mb-3" />
                <p className="text-sm font-semibold text-on-surface">No results found for "{searchQuery}"</p>
                <p className="text-xs text-secondary mt-1">Try a different keyword or browse by category, or contact our team below.</p>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div id="contact-form" className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-soft p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-on-background">Contact Customer Support</h2>
                <p className="text-xs text-secondary">We reply within 2 business hours, Mon–Fri 9am–6pm IST.</p>
              </div>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-on-background">Message Received!</h3>
                <p className="text-sm text-secondary mt-1">
                  Thanks, <strong>{form.name}</strong>! We'll reply to <strong>{form.email}</strong> within 2 business hours.
                </p>
                <button onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-semibold text-primary hover:underline">
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1.5">Full Name *</label>
                  <input name="name" required value={form.name} onChange={handleChange}
                    type="text" placeholder="Alex Thompson"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/30 bg-surface-container-low/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-secondary" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1.5">Email Address *</label>
                  <input name="email" required value={form.email} onChange={handleChange}
                    type="email" placeholder="you@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/30 bg-surface-container-low/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-secondary" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1.5">Category</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/30 bg-surface-container-low/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option value="general">General Enquiry</option>
                    <option value="order">Order / Delivery Issue</option>
                    <option value="return">Return or Refund Request</option>
                    <option value="payment">Payment Problem</option>
                    <option value="account">Account Help</option>
                    <option value="product">Product Enquiry</option>
                    <option value="security">Privacy / Security</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1.5">Order ID <span className="text-secondary font-normal">(optional)</span></label>
                  <input name="orderId" value={form.orderId} onChange={handleChange}
                    type="text" placeholder="e.g. ORD-2026-8842"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/30 bg-surface-container-low/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-secondary" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-on-surface block mb-1.5">Subject *</label>
                  <input name="subject" required value={form.subject} onChange={handleChange}
                    type="text" placeholder="Brief description of your issue"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/30 bg-surface-container-low/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-secondary" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-on-surface block mb-1.5">Message *</label>
                  <textarea name="message" required value={form.message} onChange={handleChange}
                    rows={5} placeholder="Describe your issue in detail, including any relevant order numbers, product names, or error messages..."
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/30 bg-surface-container-low/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-secondary resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit"
                    className="w-full py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-md">
                    <MessageSquare className="w-4 h-4" />
                    Send Message to Support
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
