import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle, Search, MessageSquare, Zap, Users, Settings, AlertTriangle,
  ChevronDown, ChevronRight, ArrowLeft, Mail, Clock, Book, RefreshCw, Shield, CheckCircle2
} from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-3 bg-white overflow-hidden mb-2">
      <button
        className="w-100 text-start p-3 d-flex justify-content-between align-items-center bg-transparent border-0"
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer' }}
      >
        <span className="fw-semibold text-dark small">{question}</span>
        {open ? <ChevronDown size={16} className="text-primary flex-shrink-0" /> : <ChevronRight size={16} className="text-muted flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1 border-top bg-light">
          <p className="text-secondary small mb-0 lh-lg">{answer}</p>
        </div>
      )}
    </div>
  );
};

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', category: 'general', subject: '', message: '' });

  const categories = [
    { id: 'all', label: 'All Topics', icon: <Book size={16} /> },
    { id: 'getting-started', label: 'Getting Started', icon: <Zap size={16} /> },
    { id: 'account', label: 'Account & Billing', icon: <Users size={16} /> },
    { id: 'projects', label: 'Projects & Tasks', icon: <Settings size={16} /> },
    { id: 'refunds', label: 'Refunds', icon: <RefreshCw size={16} /> },
    { id: 'security', label: 'Security & Privacy', icon: <Shield size={16} /> },
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I create my first project?',
      answer: 'After signing in, click the "New Project" button in the top navigation bar. Enter a project name, optional description, and click Create. You will be automatically assigned as the project owner and taken directly to the Kanban board.',
    },
    {
      category: 'getting-started',
      question: 'How does the Quick Demo Login work?',
      answer: 'The Quick Demo feature on the Sign In page lets you instantly log in as one of our three pre-configured team personas (Alex Thompson, Sarah Connor, or David Kim) without needing to register or create a password. Data created during demo sessions is fully persisted to our Supabase PostgreSQL database.',
    },
    {
      category: 'getting-started',
      question: 'What is the difference between To Do, In Progress, and Done columns?',
      answer: '"To Do" holds tasks that are queued for work. "In Progress" contains actively worked tasks. "Done" is where completed tasks are moved. You can drag cards between columns or use the task\'s status dropdown inside the task modal. Real-time updates are pushed instantly to all team members on the same board via Socket.io.',
    },
    {
      category: 'projects',
      question: 'How do I invite team members to a project?',
      answer: 'Open a project and click the team member avatars or the "Manage Members" button in the board header. Enter the team member\'s email address, assign them a role (Admin or Member), and click Invite. They will appear immediately in the project once their account is found.',
    },
    {
      category: 'projects',
      question: 'Can I assign tasks to specific team members?',
      answer: 'Yes. When creating or editing a task via the Task Modal, use the "Assignee" dropdown to select any member from the project. Assigned tasks will display the member\'s avatar chip on the task card in the Kanban view.',
    },
    {
      category: 'projects',
      question: 'How do I set task priorities and due dates?',
      answer: 'Open any task card to reveal the Task Modal. Inside, you can set the priority (Low, Medium, High) and pick a due date from the calendar picker. High-priority tasks display a red flag indicator on the Kanban card.',
    },
    {
      category: 'projects',
      question: 'What happens if I delete a project?',
      answer: 'Deleting a project permanently removes all tasks, comments, and member associations tied to that project. This action is irreversible. Only the project owner can delete a project. You will be prompted to confirm before deletion.',
    },
    {
      category: 'account',
      question: 'How do I update my name or profile photo?',
      answer: 'Click on your user avatar in the top navigation bar to open Clerk\'s account management portal. From there you can update your display name, profile picture, and linked email addresses.',
    },
    {
      category: 'account',
      question: 'What plans does ProjectManager offer?',
      answer: 'ProjectManager offers a fully functional free tier for individuals and small teams. Pro and Team plans (with enhanced storage, priority support, and advanced permissions) are available as paid subscriptions billed monthly or annually.',
    },
    {
      category: 'refunds',
      question: 'What is your refund policy?',
      answer: 'We offer a 7-day, no-questions-asked, 100% full refund on all paid subscriptions. Submit a refund request within 7 calendar days of your purchase date via our Help Center or by emailing refunds@projectmanager.io. Refunds are processed within 2–5 business days to the original payment method.',
    },
    {
      category: 'refunds',
      question: 'Can I get a refund after the 7-day window?',
      answer: 'Refunds are not automatically approved after 7 days. However, if you experienced a billing error, technical failure on our end, or other extenuating circumstances, please contact our support team and we will review your case individually.',
    },
    {
      category: 'security',
      question: 'Is my project data secure?',
      answer: 'Yes. All data is transmitted over HTTPS / TLS 1.3 and stored encrypted at rest in Supabase (AES-256). Authentication is handled entirely by Clerk\'s SOC 2 certified infrastructure. We do not store passwords, payment card numbers, or unencrypted tokens.',
    },
    {
      category: 'security',
      question: 'Who can see my project data?',
      answer: 'Only you and explicitly invited project members can access your project data. Each project enforces role-based access control (Owner, Admin, Member). We do not share your project content with any third parties.',
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchSearch = !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-vh-100">
      {/* Page Hero */}
      <div className="border-bottom text-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)' }}>
        <div className="container py-5">
          <Link to="/" className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 mb-4 rounded-2">
            <ArrowLeft size={15} /> Back to Home
          </Link>
          <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
            <div className="p-3 rounded-3 bg-primary text-white">
              <HelpCircle size={28} />
            </div>
            <h1 className="fw-bold mb-0 text-dark" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>
              Help Center
            </h1>
          </div>
          <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '580px' }}>
            Find answers to common questions, learn how to use ProjectManager, or reach out to our support team directly.
          </p>

          {/* Search Bar */}
          <div className="mx-auto" style={{ maxWidth: '560px' }}>
            <div className="input-group shadow-sm rounded-3 overflow-hidden border bg-white">
              <span className="input-group-text bg-white border-0 text-muted">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control border-0 py-2.5 pe-3"
                placeholder="Search for answers... e.g. 'how to invite members'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.95rem' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Banner */}
      <div className="bg-light border-bottom py-3">
        <div className="container">
          <div className="row g-3 justify-content-center">
            {[
              { icon: <RefreshCw size={18} className="text-success" />, label: '7-Day Refund Policy', to: '/return-policy' },
              { icon: <Shield size={18} className="text-primary" />, label: 'Privacy Policy', to: '/privacy-policy' },
              { icon: <Mail size={18} className="text-secondary" />, label: 'Email Support', to: 'mailto:support@projectmanager.io' },
              { icon: <Clock size={18} className="text-warning-emphasis" />, label: 'Response: < 2 hours', to: null },
            ].map((item, i) => (
              <div key={i} className="col-6 col-md-3">
                {item.to ? (
                  <Link to={item.to} className="d-flex align-items-center gap-2 p-2.5 bg-white rounded-3 border text-decoration-none text-secondary small justify-content-center fw-semibold">
                    {item.icon} {item.label}
                  </Link>
                ) : (
                  <div className="d-flex align-items-center gap-2 p-2.5 bg-white rounded-3 border text-secondary small justify-content-center fw-semibold">
                    {item.icon} {item.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-5">
          {/* Category Sidebar */}
          <div className="col-lg-3">
            <div className="pm-card-static p-3 rounded-3 sticky-top" style={{ top: '80px' }}>
              <h6 className="fw-bold text-dark mb-3 small text-uppercase font-mono">Browse by Topic</h6>
              <div className="d-flex flex-column gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`btn text-start btn-sm d-inline-flex align-items-center gap-2 rounded-2 py-2 ${activeCategory === cat.id ? 'btn-primary-pm' : 'btn-light text-secondary'}`}
                    onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="col-lg-9">
            {/* FAQ Section */}
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold text-dark mb-0" style={{ fontFamily: 'var(--font-display)' }}>
                  Frequently Asked Questions
                </h4>
                <span className="badge bg-light text-secondary border font-mono">
                  {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'}
                </span>
              </div>

              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, i) => (
                  <FAQItem key={i} question={faq.question} answer={faq.answer} />
                ))
              ) : (
                <div className="text-center py-5 border rounded-3 bg-light">
                  <HelpCircle size={40} className="text-muted mb-3" />
                  <p className="text-secondary fw-semibold">No results found for "{searchQuery}"</p>
                  <p className="text-muted small">Try different keywords or contact our support team below.</p>
                </div>
              )}
            </div>

            {/* Contact Support Form */}
            <div id="contact-form" className="pm-card p-4 bg-white">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="p-2 rounded-2 bg-primary-subtle text-primary">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h5 className="fw-bold text-dark mb-0" style={{ fontFamily: 'var(--font-display)' }}>
                    Still Need Help? Contact Support
                  </h5>
                  <small className="text-muted">Our team responds within 2 business hours, Mon–Fri 9am–6pm IST.</small>
                </div>
              </div>

              {submitted ? (
                <div className="text-center py-4">
                  <CheckCircle2 size={48} className="text-success mb-3" />
                  <h5 className="fw-bold text-dark">Message Received!</h5>
                  <p className="text-secondary">
                    Thanks, <strong>{formData.name}</strong>! We've received your message and will reply to <strong>{formData.email}</strong> within 2 business hours.
                  </p>
                  <button className="btn btn-outline-primary btn-sm rounded-2" onClick={() => setSubmitted(false)}>
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-dark">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control form-control-sm rounded-2"
                        placeholder="e.g. Alex Thompson"
                        required
                        value={formData.name}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-dark">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-sm rounded-2"
                        placeholder="you@example.com"
                        required
                        value={formData.email}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-dark">Category</label>
                      <select
                        name="category"
                        className="form-select form-select-sm rounded-2"
                        value={formData.category}
                        onChange={handleFormChange}
                      >
                        <option value="general">General Question</option>
                        <option value="technical">Technical Issue</option>
                        <option value="billing">Billing / Subscription</option>
                        <option value="refund">Refund Request</option>
                        <option value="feature">Feature Request</option>
                        <option value="security">Security / Privacy</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-dark">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        className="form-control form-control-sm rounded-2"
                        placeholder="Brief summary of your issue"
                        required
                        value={formData.subject}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-dark">Message *</label>
                      <textarea
                        name="message"
                        className="form-control form-control-sm rounded-2"
                        rows={5}
                        placeholder="Describe your issue or question in detail. Include any relevant project names, error messages, or screenshots."
                        required
                        value={formData.message}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn-saas-primary w-100 justify-content-center py-2.5">
                        <MessageSquare size={16} /> Send Message to Support
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
