import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Lock, Database, Bell, UserCheck, Globe, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const lastUpdated = 'August 24, 2026';

  const sections = [
    {
      id: 'information-collected',
      icon: <Eye size={20} />,
      title: '1. Information We Collect',
      content: (
        <div className="text-secondary lh-lg">
          <p>We collect information you provide directly to us when creating an account, using our platform, or contacting support. This includes:</p>
          <ul className="list-unstyled ps-3 mt-2">
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span><strong>Account Information:</strong> Your name, email address, and profile photo (sourced from Clerk Authentication).</span></li>
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span><strong>Project Data:</strong> Projects you create, tasks you assign, comments you write, and team members you invite.</span></li>
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span><strong>Usage Data:</strong> Log data, IP addresses, browser type, pages visited, and session duration collected automatically.</span></li>
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span><strong>Communication Data:</strong> Any messages or support queries you send to our team.</span></li>
          </ul>
        </div>
      ),
    },
    {
      id: 'how-we-use',
      icon: <Database size={20} />,
      title: '2. How We Use Your Information',
      content: (
        <div className="text-secondary lh-lg">
          <p>We use the information we collect exclusively to provide, maintain, and improve the ProjectManager platform:</p>
          <ul className="list-unstyled ps-3 mt-2">
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span>Authenticating your identity and managing your session securely via Clerk.</span></li>
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span>Storing and synchronizing your project boards, tasks, and comments in our Supabase PostgreSQL database.</span></li>
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span>Sending you transactional emails (e.g., project invitations, password resets).</span></li>
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span>Monitoring platform performance and diagnosing technical issues.</span></li>
          </ul>
          <p className="mt-2">We do <strong className="text-dark">not</strong> sell, rent, or trade your personal data to any third party for marketing or advertising purposes.</p>
        </div>
      ),
    },
    {
      id: 'data-security',
      icon: <Lock size={20} />,
      title: '3. Data Security & Protection',
      content: (
        <div className="text-secondary lh-lg">
          <p>We implement industry-standard technical and organizational measures to protect your personal information:</p>
          <ul className="list-unstyled ps-3 mt-2">
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span><strong>Encrypted in Transit:</strong> All data is transmitted over HTTPS / TLS 1.3 encrypted connections.</span></li>
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span><strong>Encrypted at Rest:</strong> Database records stored in Supabase are encrypted at rest using AES-256.</span></li>
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span><strong>Clerk Authentication:</strong> We delegate all authentication secrets, tokens, and credentials to Clerk's SOC 2 certified infrastructure.</span></li>
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span><strong>Role-Based Access:</strong> Only authorized team members can access project data via enforced permission controls.</span></li>
          </ul>
        </div>
      ),
    },
    {
      id: 'cookies',
      icon: <Globe size={20} />,
      title: '4. Cookies & Tracking',
      content: (
        <div className="text-secondary lh-lg">
          <p>We use cookies and similar tracking technologies solely to operate the platform:</p>
          <ul className="list-unstyled ps-3 mt-2">
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span><strong>Session Cookies:</strong> Used by Clerk to maintain authenticated sessions across page refreshes.</span></li>
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span><strong>Preference Cookies:</strong> Persisting user UI preferences (e.g., collapsed sidebar, theme).</span></li>
          </ul>
          <p className="mt-2">We do not use advertising cookies, cross-site tracking scripts, or sell cookie-based behavioural data.</p>
        </div>
      ),
    },
    {
      id: 'your-rights',
      icon: <UserCheck size={20} />,
      title: '5. Your Data Rights',
      content: (
        <div className="text-secondary lh-lg">
          <p>You retain full ownership of your data. You may, at any time:</p>
          <ul className="list-unstyled ps-3 mt-2">
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span><strong>Access:</strong> View all personal data associated with your account from your Profile page.</span></li>
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span><strong>Correct:</strong> Update your name, email, or avatar via your Clerk profile settings.</span></li>
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span><strong>Delete:</strong> Request permanent deletion of your account and all associated data by contacting our support team.</span></li>
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span><strong>Export:</strong> Request a data export in JSON format from our support team within 5 business days.</span></li>
          </ul>
        </div>
      ),
    },
    {
      id: 'changes',
      icon: <Bell size={20} />,
      title: '6. Policy Changes',
      content: (
        <div className="text-secondary lh-lg">
          <p>We may update this Privacy Policy periodically. When we make material changes, we will:</p>
          <ul className="list-unstyled ps-3 mt-2">
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span>Update the "Last Updated" date at the top of this page.</span></li>
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span>Send an email notification to all registered users at least 7 days before the change takes effect.</span></li>
            <li className="d-flex align-items-start gap-2 mb-2"><CheckCircle2 size={16} className="text-success mt-1 flex-shrink-0" /><span>Display an in-app banner notification on first login after the update.</span></li>
          </ul>
          <p className="mt-2">Continued use of the platform after changes take effect constitutes acceptance of the revised policy.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white min-vh-100">
      {/* Page Hero */}
      <div className="border-bottom" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)' }}>
        <div className="container py-5">
          <Link to="/" className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 mb-4 rounded-2">
            <ArrowLeft size={15} /> Back to Home
          </Link>
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="p-3 rounded-3 bg-primary text-white">
              <Shield size={28} />
            </div>
            <div>
              <h1 className="fw-bold mb-0 text-dark" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>
                Privacy Policy
              </h1>
              <p className="text-muted mb-0 small">Last updated: {lastUpdated}</p>
            </div>
          </div>
          <p className="text-secondary lh-lg" style={{ maxWidth: '720px' }}>
            At <strong>ProjectManager</strong>, we are committed to protecting your personal information and being transparent about how we handle it.
            This policy explains what data we collect, why we collect it, and how it is protected.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-5">
        <div className="row g-5">
          {/* Table of Contents Sidebar */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="pm-card-static p-3 rounded-3 sticky-top" style={{ top: '80px' }}>
              <h6 className="fw-bold text-dark mb-3 small text-uppercase font-mono">Contents</h6>
              <nav className="d-flex flex-column gap-1">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="text-secondary text-decoration-none small py-1 px-2 rounded-2 hover:bg-light">
                    {s.title}
                  </a>
                ))}
              </nav>
              <hr className="my-3" />
              <p className="small text-muted mb-2">Questions about our policy?</p>
              <Link to="/help" className="btn btn-outline-primary btn-sm w-100 rounded-2">
                Contact Support
              </Link>
            </div>
          </div>

          {/* Main Policy Content */}
          <div className="col-lg-9">
            <div className="d-flex flex-column gap-4">
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="pm-card p-4 bg-white">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="p-2 rounded-2 bg-primary-subtle text-primary">
                      {section.icon}
                    </div>
                    <h5 className="fw-bold text-dark mb-0" style={{ fontFamily: 'var(--font-display)' }}>
                      {section.title}
                    </h5>
                  </div>
                  {section.content}
                </div>
              ))}

              {/* Contact Section */}
              <div className="p-4 rounded-3 bg-primary-subtle border border-primary border-opacity-25">
                <h5 className="fw-bold text-dark mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  7. Contact Us
                </h5>
                <p className="text-secondary mb-3">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please reach out to us:
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <div className="p-3 bg-white rounded-3 border small">
                    <div className="fw-bold text-dark">📧 Email</div>
                    <div className="text-muted font-mono">privacy@projectmanager.io</div>
                  </div>
                  <div className="p-3 bg-white rounded-3 border small">
                    <div className="fw-bold text-dark">📋 Support Portal</div>
                    <Link to="/help" className="text-primary fw-semibold text-decoration-none">
                      projectmanager.io/help
                    </Link>
                  </div>
                  <div className="p-3 bg-white rounded-3 border small">
                    <div className="fw-bold text-dark">⏱️ Response Time</div>
                    <div className="text-muted">Within 2 business days</div>
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

export default PrivacyPolicyPage;
