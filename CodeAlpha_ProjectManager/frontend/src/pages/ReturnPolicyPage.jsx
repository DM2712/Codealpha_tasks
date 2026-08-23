import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, CheckCircle2, XCircle, Clock, AlertTriangle, Package, ArrowLeft, Shield, HelpCircle, Mail } from 'lucide-react';

const ReturnPolicyPage = () => {
  const lastUpdated = 'August 24, 2026';

  return (
    <div className="bg-white min-vh-100">
      {/* Page Hero */}
      <div className="border-bottom" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)' }}>
        <div className="container py-5">
          <Link to="/" className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 mb-4 rounded-2">
            <ArrowLeft size={15} /> Back to Home
          </Link>
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="p-3 rounded-3 bg-success text-white">
              <RefreshCw size={28} />
            </div>
            <div>
              <h1 className="fw-bold mb-0 text-dark" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>
                Refund & Return Policy
              </h1>
              <p className="text-muted mb-0 small">Last updated: {lastUpdated}</p>
            </div>
          </div>
          <p className="text-secondary lh-lg" style={{ maxWidth: '720px' }}>
            We want you to be completely satisfied with <strong>ProjectManager</strong>. If you are not happy with any premium subscription or paid feature,
            our <strong className="text-success">7-Day Hassle-Free Refund Policy</strong> ensures you can get your money back — no questions asked.
          </p>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="bg-light border-bottom py-4">
        <div className="container">
          <div className="row g-3 text-center">
            <div className="col-6 col-md-3">
              <div className="bg-white border rounded-3 p-3 h-100">
                <div className="text-success fw-bold" style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)' }}>7</div>
                <div className="small fw-semibold text-dark">Day Refund Window</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>From date of purchase</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="bg-white border rounded-3 p-3 h-100">
                <div className="text-primary fw-bold" style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)' }}>100%</div>
                <div className="small fw-semibold text-dark">Full Refund Guaranteed</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>No partial amounts</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="bg-white border rounded-3 p-3 h-100">
                <div className="text-warning-emphasis fw-bold" style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)' }}>2</div>
                <div className="small fw-semibold text-dark">Business Days to Process</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>After approval</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="bg-white border rounded-3 p-3 h-100">
                <div className="text-secondary fw-bold" style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)' }}>0</div>
                <div className="small fw-semibold text-dark">Questions Asked</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>Hassle-free process</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-5">
          {/* Sidebar */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="pm-card-static p-3 rounded-3 sticky-top" style={{ top: '80px' }}>
              <h6 className="fw-bold text-dark mb-3 small text-uppercase font-mono">Contents</h6>
              <nav className="d-flex flex-column gap-1">
                {['Eligibility', 'How to Request', 'Processing & Timeline', 'What Is Not Eligible', 'Free Tier Policy', 'Contact'].map((label, i) => (
                  <a key={label} href={`#section-${i + 1}`} className="text-secondary text-decoration-none small py-1 px-2 rounded-2 hover:bg-light">
                    {i + 1}. {label}
                  </a>
                ))}
              </nav>
              <hr className="my-3" />
              <Link to="/help" className="btn btn-outline-success btn-sm w-100 rounded-2">
                Request a Refund
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="d-flex flex-column gap-4">

              {/* Section 1 */}
              <div id="section-1" className="pm-card p-4 bg-white">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2 rounded-2 bg-success-subtle text-success"><CheckCircle2 size={20} /></div>
                  <h5 className="fw-bold text-dark mb-0" style={{ fontFamily: 'var(--font-display)' }}>1. Eligibility for a Refund</h5>
                </div>
                <p className="text-secondary lh-lg">
                  To qualify for a full refund under our 7-Day Return Policy, all of the following must apply:
                </p>
                <ul className="list-unstyled ps-3">
                  <li className="d-flex align-items-start gap-2 mb-2">
                    <CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" />
                    <span className="text-secondary"><strong className="text-dark">Within 7 calendar days</strong> of the original subscription purchase or upgrade date.</span>
                  </li>
                  <li className="d-flex align-items-start gap-2 mb-2">
                    <CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" />
                    <span className="text-secondary">The request is submitted by the <strong className="text-dark">account owner</strong> (matching the billing email).</span>
                  </li>
                  <li className="d-flex align-items-start gap-2 mb-2">
                    <CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" />
                    <span className="text-secondary">The subscription is a <strong className="text-dark">paid Pro or Team plan</strong> (not a free tier or promotional coupon).</span>
                  </li>
                  <li className="d-flex align-items-start gap-2 mb-2">
                    <CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" />
                    <span className="text-secondary">The account has not been flagged for <strong className="text-dark">Terms of Service violations</strong> or abuse.</span>
                  </li>
                </ul>
                <div className="mt-3 p-3 rounded-3 bg-success-subtle border border-success border-opacity-25">
                  <p className="text-success fw-semibold mb-0 small">
                    ✅ All eligible refund requests receive <strong>100% of the original charge back</strong> — no processing fees or deductions.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div id="section-2" className="pm-card p-4 bg-white">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2 rounded-2 bg-primary-subtle text-primary"><Package size={20} /></div>
                  <h5 className="fw-bold text-dark mb-0" style={{ fontFamily: 'var(--font-display)' }}>2. How to Request a Refund</h5>
                </div>
                <p className="text-secondary lh-lg">
                  Our refund process is designed to be as simple and transparent as possible. Follow these steps:
                </p>

                <div className="d-flex flex-column gap-3 mt-3">
                  {[
                    { step: '1', title: 'Submit a Request', desc: 'Visit our Help Center at /help or email refunds@projectmanager.io with your registered account email and order reference number.' },
                    { step: '2', title: 'Verification', desc: 'Our support team verifies your identity and purchase eligibility. This typically takes less than 4 business hours.' },
                    { step: '3', title: 'Approval Confirmation', desc: 'You will receive an email confirmation once the refund is approved with the exact amount being processed.' },
                    { step: '4', title: 'Funds Returned', desc: 'Refunds are processed within 2–5 business days to the original payment method (credit card, debit card, or PayPal).' },
                  ].map((item) => (
                    <div key={item.step} className="d-flex gap-3 p-3 bg-light rounded-3 border">
                      <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold flex-shrink-0 font-mono" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                        {item.step}
                      </div>
                      <div>
                        <div className="fw-bold text-dark small">{item.title}</div>
                        <div className="text-secondary small">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3 */}
              <div id="section-3" className="pm-card p-4 bg-white">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2 rounded-2 bg-warning-subtle text-warning-emphasis"><Clock size={20} /></div>
                  <h5 className="fw-bold text-dark mb-0" style={{ fontFamily: 'var(--font-display)' }}>3. Processing Timeline</h5>
                </div>
                <div className="table-responsive mt-2">
                  <table className="table table-bordered table-sm small align-middle">
                    <thead className="table-light">
                      <tr>
                        <th className="font-mono text-uppercase small">Stage</th>
                        <th className="font-mono text-uppercase small">Duration</th>
                        <th className="font-mono text-uppercase small">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="text-secondary">
                      <tr>
                        <td className="fw-semibold text-dark">Request Submission</td>
                        <td><span className="badge bg-success text-white font-mono">Instant</span></td>
                        <td>Confirmation email sent immediately</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold text-dark">Eligibility Review</td>
                        <td><span className="badge bg-primary text-white font-mono">≤ 4 hours</span></td>
                        <td>Business hours: Mon–Fri, 9am–6pm IST</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold text-dark">Refund Initiated</td>
                        <td><span className="badge bg-warning text-dark font-mono">1–2 business days</span></td>
                        <td>After approval, sent to payment processor</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold text-dark">Funds in Account</td>
                        <td><span className="badge bg-secondary text-white font-mono">3–5 business days</span></td>
                        <td>Depends on your bank or card network</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 4 */}
              <div id="section-4" className="pm-card p-4 bg-white">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2 rounded-2 bg-danger-subtle text-danger"><XCircle size={20} /></div>
                  <h5 className="fw-bold text-dark mb-0" style={{ fontFamily: 'var(--font-display)' }}>4. What Is Not Eligible for Refund</h5>
                </div>
                <p className="text-secondary lh-lg mb-3">The following situations are not covered by our 7-Day Refund Policy:</p>
                <ul className="list-unstyled ps-3">
                  {[
                    'Subscription renewals (monthly or annual) requested more than 7 days after the billing date.',
                    'Accounts that have been suspended or terminated for violating our Terms of Service.',
                    'Promotional, discounted, or coupon-code purchases unless explicitly stated.',
                    'Refund requests submitted after the 7-day window has elapsed.',
                    'Accounts that have previously received a refund under this policy in the last 12 months.',
                  ].map((item, i) => (
                    <li key={i} className="d-flex align-items-start gap-2 mb-2">
                      <XCircle size={16} className="text-danger mt-1 flex-shrink-0" />
                      <span className="text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="p-3 rounded-3 bg-warning-subtle border border-warning border-opacity-25 mt-3">
                  <div className="d-flex align-items-start gap-2">
                    <AlertTriangle size={16} className="text-warning-emphasis mt-0.5 flex-shrink-0" />
                    <p className="text-warning-emphasis small mb-0">
                      In exceptional circumstances (e.g., billing errors or technical failures on our side), we may offer refunds outside this policy at our sole discretion.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div id="section-5" className="pm-card p-4 bg-white">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2 rounded-2 bg-secondary-subtle text-secondary"><Shield size={20} /></div>
                  <h5 className="fw-bold text-dark mb-0" style={{ fontFamily: 'var(--font-display)' }}>5. Free Tier & Demo Accounts</h5>
                </div>
                <p className="text-secondary lh-lg">
                  ProjectManager offers a fully featured <strong className="text-dark">free tier</strong> and instant <strong className="text-dark">demo accounts</strong> with no payment required.
                  Since no financial transaction is involved, refund requests do not apply to free or demo usage.
                  If you wish to discontinue free usage, simply delete your account from your Profile settings — no action needed.
                </p>
              </div>

              {/* Section 6 — Contact */}
              <div id="section-6" className="p-4 rounded-3 bg-primary-subtle border border-primary border-opacity-25">
                <h5 className="fw-bold text-dark mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  6. Contact Our Refund Team
                </h5>
                <p className="text-secondary mb-3 lh-lg">
                  Our dedicated support team is available Monday to Friday, 9am–6pm IST. We aim to resolve all refund requests fairly and promptly.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <div className="p-3 bg-white rounded-3 border small">
                    <div className="fw-bold text-dark">📧 Email</div>
                    <div className="text-muted font-mono">refunds@projectmanager.io</div>
                  </div>
                  <div className="p-3 bg-white rounded-3 border small">
                    <div className="fw-bold text-dark">📋 Help Center</div>
                    <Link to="/help" className="text-primary fw-semibold text-decoration-none">
                      Open Support Ticket
                    </Link>
                  </div>
                  <div className="p-3 bg-white rounded-3 border small">
                    <div className="fw-bold text-dark">⏱️ Response Time</div>
                    <div className="text-muted">Within 4 business hours</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
