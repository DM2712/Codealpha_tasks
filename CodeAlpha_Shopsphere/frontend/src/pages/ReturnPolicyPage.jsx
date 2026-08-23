import React from 'react';
import { Link } from 'react-router-dom';
import {
  RotateCcw, CheckCircle, XCircle, Clock, AlertTriangle, PackageOpen, ArrowLeft, ShieldCheck
} from 'lucide-react';

export const ReturnPolicyPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-surface-container-low/50 border border-emerald-200/40 p-8 md:p-12 mb-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-md">
            <RotateCcw className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-on-background">
              Returns &amp; Refund Policy
            </h1>
            <p className="text-xs text-secondary mt-0.5">Last updated: August 24, 2026</p>
          </div>
        </div>
        <p className="text-sm text-secondary leading-relaxed max-w-2xl">
          We want you to love every order. If something isn't right,
          our <strong className="text-emerald-700">7-Day Hassle-Free Return Policy</strong> ensures
          a full refund with zero friction — no questions asked.
        </p>
      </div>

      {/* Quick Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { metric: '7', unit: 'Days', desc: 'Return window from delivery' },
          { metric: '100%', unit: 'Refund', desc: 'Full amount, no deductions' },
          { metric: '2–5', unit: 'Biz Days', desc: 'For funds to appear in account' },
          { metric: '0', unit: 'Questions', desc: 'Completely hassle-free' },
        ].map(({ metric, unit, desc }) => (
          <div key={unit} className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-soft p-4 text-center">
            <div className="text-3xl font-extrabold text-primary font-mono leading-none">{metric}</div>
            <div className="text-xs font-bold text-on-surface mt-1">{unit}</div>
            <div className="text-xs text-secondary mt-0.5">{desc}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-outline-variant/20 bg-surface-container-low/30 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface mb-3">Contents</p>
            <nav className="flex flex-col gap-1">
              {[
                ['#eligibility', 'Eligibility'],
                ['#how-to-return', 'How to Return'],
                ['#timeline', 'Processing Timeline'],
                ['#non-returnable', 'Non-Returnable Items'],
                ['#exchanges', 'Exchanges'],
                ['#contact', 'Contact Us'],
              ].map(([href, label]) => (
                <a key={href} href={href}
                  className="text-xs text-secondary hover:text-primary px-2 py-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                  {label}
                </a>
              ))}
            </nav>
            <hr className="my-3 border-outline-variant/20" />
            <Link to="/help" className="block text-center text-xs font-semibold bg-emerald-600 text-white px-3 py-2 rounded-xl hover:bg-emerald-700 transition-colors">
              Start a Return
            </Link>
          </div>
        </aside>

        <div className="lg:col-span-3 flex flex-col gap-4">

          {/* Eligibility */}
          <div id="eligibility" className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-soft p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-on-background">1. Eligibility for a Return</h2>
            </div>
            <p className="text-sm text-secondary leading-relaxed mb-4">
              To qualify for a full refund, your return must meet the following conditions:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                'Return is requested within 7 calendar days of the delivery date.',
                'Item is unused, unwashed, and in its original packaging with all tags attached.',
                'Return is initiated by the purchasing account holder.',
                'The item is not listed under our Non-Returnable Items section.',
                'Order was placed at full price (sale items follow a separate process — see below).',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-secondary">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-3 text-sm text-emerald-800 font-medium">
              ✅ All eligible returns receive a <strong>100% refund</strong> to the original payment method — including shipping costs where the error was ours.
            </div>
          </div>

          {/* How to Return */}
          <div id="how-to-return" className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-soft p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                <PackageOpen className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-on-background">2. How to Initiate a Return</h2>
            </div>
            <div className="flex flex-col gap-3">
              {[
                ['1', 'Log In & Find Your Order', 'Go to My Orders in your ShopSphere account. Select the order containing the item you wish to return.'],
                ['2', 'Click "Return Item"', 'Select the specific product and choose a return reason from the dropdown (e.g., Defective, Wrong Item, Changed Mind).'],
                ['3', 'Print Your Label', 'We will email you a pre-paid return shipping label within 30 minutes of submission.'],
                ['4', 'Drop Off Your Parcel', 'Pack the item securely, attach the label, and drop it at any listed courier point within 7 days.'],
                ['5', 'Receive Your Refund', 'Once we receive and inspect the item, your refund is initiated within 1–2 business days.'],
              ].map(([step, title, desc]) => (
                <div key={step} className="flex gap-3 p-3 bg-surface-container-low/40 rounded-xl border border-outline-variant/20">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm font-mono shrink-0">
                    {step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{title}</p>
                    <p className="text-xs text-secondary mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Table */}
          <div id="timeline" className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-soft p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-on-background">3. Refund Processing Timeline</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="py-2 pr-4 text-xs font-bold uppercase tracking-wider text-secondary">Stage</th>
                    <th className="py-2 pr-4 text-xs font-bold uppercase tracking-wider text-secondary">Duration</th>
                    <th className="py-2 text-xs font-bold uppercase tracking-wider text-secondary">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {[
                    ['Return Submitted', 'Instant', 'bg-emerald-100 text-emerald-700', 'Confirmation email sent immediately.'],
                    ['Return Label Issued', '≤ 30 minutes', 'bg-blue-100 text-blue-700', 'Pre-paid label emailed to you.'],
                    ['Item Received & Inspected', '1–3 business days', 'bg-amber-100 text-amber-700', 'After we receive the parcel at our warehouse.'],
                    ['Refund Initiated', '1–2 business days', 'bg-primary-fixed text-primary', 'Sent to your original payment method.'],
                    ['Funds in Your Account', '3–5 business days', 'bg-surface-container text-secondary', 'Depends on your bank or card network.'],
                  ].map(([stage, duration, badgeCls, note]) => (
                    <tr key={stage} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="py-2.5 pr-4 font-medium text-on-surface text-sm">{stage}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold font-mono ${badgeCls}`}>{duration}</span>
                      </td>
                      <td className="py-2.5 text-xs text-secondary">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Non-Returnable */}
          <div id="non-returnable" className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-soft p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-on-background">4. Non-Returnable Items</h2>
            </div>
            <p className="text-sm text-secondary leading-relaxed mb-3">
              For hygiene, safety, or digital licensing reasons, the following categories cannot be returned:
            </p>
            <div className="grid sm:grid-cols-2 gap-2 mb-4">
              {[
                '🧴 Opened skincare, beauty, or fragrance products',
                '🩱 Swimwear and intimate apparel (for hygiene reasons)',
                '📦 Items with broken seals or missing original packaging',
                '💿 Downloaded digital software or media licenses',
                '🛒 Final-sale or clearance items marked "Non-Returnable"',
                '🎁 Gift cards and store credit vouchers',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-secondary bg-red-50 border border-red-100 rounded-xl p-2.5">
                  <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                In exceptional circumstances (e.g., a defective sealed product), please contact our
                support team and we will assess your case individually, even outside the standard policy.
              </span>
            </div>
          </div>

          {/* Exchanges */}
          <div id="exchanges" className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-soft p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-on-background">5. Exchanges</h2>
            </div>
            <p className="text-sm text-secondary leading-relaxed">
              We currently do not offer direct size or colour exchanges. Instead, we recommend initiating a return for the
              unwanted item and placing a new order for the correct variant. This ensures the fastest turnaround and
              availability of your preferred item. Refunds on the original order are processed concurrently.
            </p>
          </div>

          {/* Contact */}
          <div id="contact" className="rounded-2xl border border-primary/20 bg-primary-fixed/20 p-6">
            <h2 className="text-base font-bold text-on-background mb-2">6. Contact Our Returns Team</h2>
            <p className="text-sm text-secondary mb-4 leading-relaxed">
              Our dedicated returns team is available Monday to Friday, 9am–6pm IST and will respond within 2 business hours.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                ['📧 Email', 'returns@shopsphere.io'],
                ['🌐 Help Center', '/help'],
                ['⏱️ Response Time', '≤ 2 business hours'],
              ].map(([label, val]) => (
                <div key={label} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-3 text-sm">
                  <p className="font-semibold text-on-surface">{label}</p>
                  {val.startsWith('/') ? (
                    <Link to={val} className="text-primary text-xs font-semibold hover:underline">Open Help Center</Link>
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
