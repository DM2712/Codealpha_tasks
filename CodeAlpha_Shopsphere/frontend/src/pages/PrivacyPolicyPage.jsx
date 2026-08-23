import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Eye, Lock, Database, Bell, UserCheck, Globe, CheckCircle, ArrowLeft, Mail
} from 'lucide-react';

const sections = [
  {
    id: 'info-collect',
    icon: <Eye className="w-5 h-5" />,
    title: '1. Information We Collect',
    body: (
      <>
        <p className="text-secondary text-sm leading-relaxed mb-3">
          When you shop on ShopSphere, we collect information to fulfil your orders and personalise your experience:
        </p>
        <ul className="space-y-2">
          {[
            ['Account Data', 'Name, email address, and hashed password when you register.'],
            ['Order & Payment Data', 'Billing address, shipping address, and order history. Card details are never stored — they are tokenised by our payment gateway (Stripe).'],
            ['Device & Usage Data', 'IP address, browser type, pages visited, and session duration collected automatically via server logs.'],
            ['Preference Data', 'Wishlist items, cart contents, and filter preferences stored in local storage and our database.'],
          ].map(([bold, text]) => (
            <li key={bold} className="flex items-start gap-2.5 text-sm text-secondary">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong className="text-on-surface">{bold}:</strong> {text}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'how-used',
    icon: <Database className="w-5 h-5" />,
    title: '2. How We Use Your Information',
    body: (
      <>
        <p className="text-secondary text-sm leading-relaxed mb-3">
          We use your data exclusively to operate and improve ShopSphere:
        </p>
        <ul className="space-y-2">
          {[
            'Process and fulfil your orders and send shipping and delivery notifications.',
            'Personalise product recommendations based on purchase and browsing history.',
            'Respond to customer service enquiries and resolve disputes.',
            'Detect and prevent fraud, abuse, and security incidents.',
            'Send transactional emails (order confirmations, refund receipts). You may opt out of marketing emails at any time.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-secondary">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-secondary mt-3">
          We do <strong className="text-on-surface">not</strong> sell, rent, or trade your personal data to third-party advertisers.
        </p>
      </>
    ),
  },
  {
    id: 'data-security',
    icon: <Lock className="w-5 h-5" />,
    title: '3. Data Security',
    body: (
      <>
        <ul className="space-y-2">
          {[
            ['HTTPS / TLS 1.3', 'All traffic between your browser and ShopSphere is encrypted in transit.'],
            ['AES-256 at Rest', 'Your data stored in our Supabase PostgreSQL database is encrypted at rest.'],
            ['PCI-DSS Compliance', 'Card data is tokenised by Stripe — we never see or store raw card numbers.'],
            ['Role-Based Access', 'Only authorised team members can access production data, enforced via row-level security policies.'],
          ].map(([bold, text]) => (
            <li key={bold} className="flex items-start gap-2.5 text-sm text-secondary">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong className="text-on-surface">{bold}:</strong> {text}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'cookies',
    icon: <Globe className="w-5 h-5" />,
    title: '4. Cookies & Tracking',
    body: (
      <>
        <p className="text-secondary text-sm leading-relaxed mb-3">
          We use strictly necessary and functional cookies only:
        </p>
        <ul className="space-y-2">
          {[
            ['Session Cookies', 'Maintain your login state across page navigations.'],
            ['Cart Cookies', 'Preserve cart contents between sessions so items are never lost.'],
            ['Preference Cookies', 'Remember your currency, region, and UI settings.'],
          ].map(([bold, text]) => (
            <li key={bold} className="flex items-start gap-2.5 text-sm text-secondary">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong className="text-on-surface">{bold}:</strong> {text}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-secondary mt-3">
          We do <strong className="text-on-surface">not</strong> use third-party advertising or cross-site tracking cookies.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    icon: <UserCheck className="w-5 h-5" />,
    title: '5. Your Rights',
    body: (
      <>
        <p className="text-secondary text-sm leading-relaxed mb-3">
          You have full rights over your personal data at any time:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            ['Access', 'Download all data associated with your account.'],
            ['Correction', 'Update your name, email, or shipping address via your Profile page.'],
            ['Deletion', 'Request permanent account and data deletion by contacting our support team.'],
            ['Portability', 'Receive a machine-readable export of your order history within 5 business days.'],
          ].map(([right, desc]) => (
            <div key={right} className="p-3 rounded-xl border border-outline-variant/30 bg-surface-container-low/30 text-sm">
              <p className="font-semibold text-on-surface mb-0.5">{right}</p>
              <p className="text-secondary text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'changes',
    icon: <Bell className="w-5 h-5" />,
    title: '6. Policy Updates',
    body: (
      <p className="text-secondary text-sm leading-relaxed">
        We may update this Privacy Policy periodically. When we make material changes, we will update the
        "Last Updated" date at the top of this page and send an email notification to all registered users
        at least <strong className="text-on-surface">7 days before</strong> the change takes effect.
        Continued use of ShopSphere after changes take effect constitutes acceptance of the revised policy.
      </p>
    ),
  },
];

export const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-primary-fixed/30 to-surface-container-low/50 border border-outline-variant/20 p-8 md:p-12 mb-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-on-background">Privacy Policy</h1>
            <p className="text-xs text-secondary mt-0.5">Last updated: August 24, 2026</p>
          </div>
        </div>
        <p className="text-sm text-secondary leading-relaxed max-w-2xl">
          At <strong className="text-on-surface">ShopSphere</strong>, your privacy is our top priority.
          This policy explains exactly what data we collect, why, and how it is protected.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-outline-variant/20 bg-surface-container-low/30 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface mb-3">Contents</p>
            <nav className="flex flex-col gap-1">
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`}
                  className="text-xs text-secondary hover:text-primary px-2 py-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                  {s.title}
                </a>
              ))}
            </nav>
            <hr className="my-3 border-outline-variant/20" />
            <Link to="/help" className="block text-center text-xs font-semibold bg-primary text-on-primary px-3 py-2 rounded-xl hover:bg-primary/90 transition-colors">
              Contact Support
            </Link>
          </div>
        </aside>

        {/* Main Sections */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {sections.map(section => (
            <div key={section.id} id={section.id}
              className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-soft">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                  {section.icon}
                </div>
                <h2 className="text-base font-bold text-on-background">{section.title}</h2>
              </div>
              {section.body}
            </div>
          ))}

          {/* Contact */}
          <div className="rounded-2xl border border-primary/20 bg-primary-fixed/20 p-6">
            <h2 className="text-base font-bold text-on-background mb-2">7. Contact Us</h2>
            <p className="text-sm text-secondary mb-4">
              For any privacy-related questions, data requests, or concerns, please reach out to our team:
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                ['📧 Email', 'privacy@shopsphere.io'],
                ['🌐 Help Center', '/help'],
                ['⏱️ Response Time', 'Within 2 business days'],
              ].map(([label, val]) => (
                <div key={label} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-3 text-sm">
                  <p className="font-semibold text-on-surface">{label}</p>
                  {val.startsWith('/') ? (
                    <Link to={val} className="text-primary text-xs font-semibold hover:underline">{val}</Link>
                  ) : (
                    <p className="text-secondary text-xs font-mono">{val}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
