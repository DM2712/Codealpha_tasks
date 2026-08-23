import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import {
  Kanban,
  CheckCircle2,
  Users,
  Shield,
  Zap,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  Lock,
  Database,
  Code2,
  Globe,
  Star,
  Check,
  ChevronRight,
  Activity,
  FolderKanban,
} from 'lucide-react';

const LandingPage = () => {
  const { isSignedIn, signInDemo } = useAppAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('board');

  const handleQuickDemo = (account) => {
    signInDemo(account);
    navigate('/dashboard');
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="position-relative pt-5 pb-5 pb-lg-6" style={{ background: 'radial-gradient(ellipse at top, #f0fdf4 0%, #f8fafc 50%, #ffffff 100%)' }}>
        <div className="container py-4 py-md-5 text-center">
          {/* Release Badge */}
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-white border shadow-sm mb-4">
            <span className="badge rounded-pill bg-primary px-2 py-0.5" style={{ fontSize: '0.7rem' }}>
              NEW
            </span>
            <span className="small text-secondary fw-semibold">
              ProjectManager 2.0 with Real-Time Collaboration
            </span>
            <Sparkles size={14} className="text-warning" />
          </div>

          {/* Main Headline */}
          <h1 className="display-3 fw-extrabold text-dark tracking-tight mb-3 mx-auto" style={{ maxWidth: '880px', fontFamily: 'var(--font-display)', lineHeight: '1.15' }}>
            Plan, Track, and Ship Projects with <span className="text-primary">Unmatched Speed</span>
          </h1>

          {/* Subtitle */}
          <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: '660px', fontSize: '1.2rem', lineHeight: '1.6' }}>
            The all-in-one collaborative workspace engineered for modern teams. Agile Kanban boards, instant task assignment, threaded comments, and secure role-based access.
          </p>

          {/* Dual CTAs */}
          <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap mb-5">
            {isSignedIn ? (
              <Link to="/dashboard" className="btn btn-primary-pm btn-lg px-4 py-2.5 shadow-sm d-inline-flex align-items-center gap-2">
                <span>Go to Dashboard</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/sign-up" className="btn btn-primary-pm btn-lg px-4 py-2.5 shadow-sm d-inline-flex align-items-center gap-2">
                  <span>Start Free Trial</span>
                  <ArrowRight size={18} />
                </Link>
                <button
                  onClick={() => handleQuickDemo(DEMO_ACCOUNTS[0])}
                  className="btn btn-outline-secondary btn-lg px-4 py-2.5 d-inline-flex align-items-center gap-2 bg-white"
                  style={{ borderRadius: '8px', fontWeight: '600' }}
                >
                  <Sparkles size={18} className="text-primary" />
                  <span>Explore Live Demo</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 2. INTERACTIVE PRODUCT SHOWCASE / MOCK KANBAN BOARD */}
        <div className="container px-3 px-md-5 mt-2">
          <div className="pm-card shadow-xl rounded-4 overflow-hidden border bg-white mx-auto" style={{ maxWidth: '1100px' }}>
            {/* Window Header */}
            <div className="px-4 py-3 bg-light border-bottom d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <span className="rounded-circle d-inline-block bg-danger opacity-75" style={{ width: '10px', height: '10px' }}></span>
                <span className="rounded-circle d-inline-block bg-warning opacity-75" style={{ width: '10px', height: '10px' }}></span>
                <span className="rounded-circle d-inline-block bg-success opacity-75" style={{ width: '10px', height: '10px' }}></span>
                <span className="ms-2 small text-muted font-mono" style={{ fontSize: '0.75rem' }}>
                  app.projectmanager.io/projects/workspace-preview
                </span>
              </div>
              <div className="badge bg-white text-secondary border font-mono small">
                LIVE DEMO PREVIEW
              </div>
            </div>

            {/* Board Mockup Content */}
            <div className="p-3 p-md-4 bg-light bg-opacity-50">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold text-dark mb-0" style={{ fontFamily: 'var(--font-display)' }}>
                    🚀 NextGen E-Commerce Platform
                  </h5>
                  <small className="text-muted">Sprint 4 • 12 of 18 Tasks Completed</small>
                </div>
                <div className="d-flex gap-2">
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1.5 rounded-pill small">
                    Sprint Active
                  </span>
                </div>
              </div>

              {/* Columns Grid */}
              <div className="row g-3">
                {/* Column 1: To Do */}
                <div className="col-md-4">
                  <div className="p-3 rounded-3 bg-white border">
                    <div className="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom">
                      <span className="small fw-bold text-uppercase text-secondary font-mono">
                        To Do (2)
                      </span>
                      <span className="badge bg-light text-dark">2</span>
                    </div>

                    <div className="d-flex flex-column gap-2">
                      <div className="p-2.5 rounded-2 bg-light border">
                        <span className="badge bg-danger-subtle text-danger font-mono" style={{ fontSize: '0.65rem' }}>HIGH</span>
                        <div className="fw-semibold small text-dark mt-1">Implement Clerk OAuth Redirects</div>
                        <div className="d-flex justify-content-between align-items-center mt-2 pt-1 border-top small text-muted">
                          <span style={{ fontSize: '0.7rem' }}>Due Oct 24</span>
                          <span className="user-avatar-initials" style={{ width: '22px', height: '22px', fontSize: '0.65rem' }}>AT</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-2 bg-light border">
                        <span className="badge bg-warning-subtle text-warning-emphasis font-mono" style={{ fontSize: '0.65rem' }}>MEDIUM</span>
                        <div className="fw-semibold small text-dark mt-1">Write Unit Tests for Project API</div>
                        <div className="d-flex justify-content-between align-items-center mt-2 pt-1 border-top small text-muted">
                          <span style={{ fontSize: '0.7rem' }}>Due Oct 26</span>
                          <span className="user-avatar-initials" style={{ width: '22px', height: '22px', fontSize: '0.65rem' }}>SC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: In Progress */}
                <div className="col-md-4">
                  <div className="p-3 rounded-3 bg-white border border-primary border-opacity-25">
                    <div className="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom border-primary">
                      <span className="small fw-bold text-uppercase text-primary font-mono">
                        In Progress (1)
                      </span>
                      <span className="badge bg-primary text-white">1</span>
                    </div>

                    <div className="d-flex flex-column gap-2">
                      <div className="p-2.5 rounded-2 bg-primary-subtle bg-opacity-25 border border-primary border-opacity-50">
                        <span className="badge bg-primary text-white font-mono" style={{ fontSize: '0.65rem' }}>FRONTEND</span>
                        <div className="fw-semibold small text-dark mt-1">Build Drag-and-Drop Kanban Columns</div>
                        <div className="d-flex justify-content-between align-items-center mt-2 pt-1 border-top small text-muted">
                          <span className="text-primary fw-semibold" style={{ fontSize: '0.7rem' }}>3 Comments</span>
                          <span className="user-avatar-initials" style={{ width: '22px', height: '22px', fontSize: '0.65rem' }}>DK</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Done */}
                <div className="col-md-4">
                  <div className="p-3 rounded-3 bg-white border">
                    <div className="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom">
                      <span className="small fw-bold text-uppercase text-success font-mono">
                        Done (3)
                      </span>
                      <span className="badge bg-success text-white">3</span>
                    </div>

                    <div className="d-flex flex-column gap-2">
                      <div className="p-2.5 rounded-2 bg-light border opacity-75">
                        <span className="badge bg-success-subtle text-success font-mono" style={{ fontSize: '0.65rem' }}>DATABASE</span>
                        <div className="fw-semibold small text-dark mt-1 text-decoration-line-through">Design Supabase Schema & Indexes</div>
                        <div className="d-flex justify-content-between align-items-center mt-2 pt-1 border-top small text-muted">
                          <span className="text-success" style={{ fontSize: '0.7rem' }}>Completed</span>
                          <span className="user-avatar-initials bg-success" style={{ width: '22px', height: '22px', fontSize: '0.65rem' }}>AT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES GRID */}
      <section className="py-5 py-md-6 border-top bg-light bg-opacity-30">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h6 className="text-primary fw-bold text-uppercase tracking-wider font-mono small">
              EVERYTHING YOU NEED TO SHIP
            </h6>
            <h2 className="display-6 fw-bold text-dark tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Built for High-Velocity Engineering & Product Teams
            </h2>
            <p className="text-secondary mx-auto mt-2" style={{ maxWidth: '600px' }}>
              Eliminate context switching and miscommunication with powerful tools designed around speed and simplicity.
            </p>
          </div>

          <div className="row g-4">
            {/* Feature 1 */}
            <div className="col-md-6 col-lg-4">
              <div className="pm-card p-4 h-100 bg-white">
                <div className="p-3 rounded-3 bg-primary-subtle text-primary d-inline-flex mb-3">
                  <Kanban size={26} />
                </div>
                <h5 className="fw-bold text-dark mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Interactive Kanban Boards
                </h5>
                <p className="text-secondary small mb-0 lh-base">
                  Visualize bottlenecks, drag cards effortlessly across To Do, In Progress, and Done stages, and keep the entire team aligned.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-md-6 col-lg-4">
              <div className="pm-card p-4 h-100 bg-white">
                <div className="p-3 rounded-3 bg-success-subtle text-success d-inline-flex mb-3">
                  <Users size={26} />
                </div>
                <h5 className="fw-bold text-dark mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Granular Team Roles
                </h5>
                <p className="text-secondary small mb-0 lh-base">
                  Invite teammates by email. Enforce Owner, Admin, and Member permissions so only authorized collaborators manage sensitive project scope.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-md-6 col-lg-4">
              <div className="pm-card p-4 h-100 bg-white">
                <div className="p-3 rounded-3 bg-warning-subtle text-warning-emphasis d-inline-flex mb-3">
                  <MessageSquare size={26} />
                </div>
                <h5 className="fw-bold text-dark mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Threaded Task Comments
                </h5>
                <p className="text-secondary small mb-0 lh-base">
                  Discuss acceptance criteria, post updates, and mention blockers directly inside task cards in real-time.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="col-md-6 col-lg-4">
              <div className="pm-card p-4 h-100 bg-white">
                <div className="p-3 rounded-3 bg-info-subtle text-info-emphasis d-inline-flex mb-3">
                  <Zap size={26} />
                </div>
                <h5 className="fw-bold text-dark mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Real-Time WebSockets
                </h5>
                <p className="text-secondary small mb-0 lh-base">
                  Powered by Socket.io for immediate board synchronization without refreshing the page or polling the database.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="col-md-6 col-lg-4">
              <div className="pm-card p-4 h-100 bg-white">
                <div className="p-3 rounded-3 bg-danger-subtle text-danger d-inline-flex mb-3">
                  <Clock size={26} />
                </div>
                <h5 className="fw-bold text-dark mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Priority & Due Date Tracking
                </h5>
                <p className="text-secondary small mb-0 lh-base">
                  Categorize tasks as Low, Medium, or High priority with visual warning flags and automated overdue deadline calculations.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="col-md-6 col-lg-4">
              <div className="pm-card p-4 h-100 bg-white">
                <div className="p-3 rounded-3 bg-secondary-subtle text-secondary d-inline-flex mb-3">
                  <Database size={26} />
                </div>
                <h5 className="fw-bold text-dark mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Cloud Database Persistence
                </h5>
                <p className="text-secondary small mb-0 lh-base">
                  Backed by Supabase PostgreSQL with relational foreign key integrity, cascaded deletes, and optimized search indexes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORKFLOW STEPS */}
      <section className="py-5 py-md-6 border-top">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h6 className="text-primary fw-bold text-uppercase tracking-wider font-mono small">
              HOW IT WORKS
            </h6>
            <h2 className="display-6 fw-bold text-dark tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              From Idea to Delivery in 3 Simple Steps
            </h2>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="p-4 rounded-4 border bg-white h-100 text-center position-relative">
                <div className="d-inline-flex p-3 rounded-circle bg-primary text-white fw-bold mb-3 font-mono" style={{ width: '48px', height: '48px' }}>
                  1
                </div>
                <h5 className="fw-bold text-dark mb-2">Create Workspace</h5>
                <p className="text-secondary small mb-0">
                  Initialize a new project with title and scope. You are automatically established as the project owner.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 border bg-white h-100 text-center position-relative">
                <div className="d-inline-flex p-3 rounded-circle bg-primary text-white fw-bold mb-3 font-mono" style={{ width: '48px', height: '48px' }}>
                  2
                </div>
                <h5 className="fw-bold text-dark mb-2">Invite & Assign</h5>
                <p className="text-secondary small mb-0">
                  Add collaborators by email, define admin roles, and assign tasks with explicit priorities and due dates.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 border bg-white h-100 text-center position-relative">
                <div className="d-inline-flex p-3 rounded-circle bg-primary text-white fw-bold mb-3 font-mono" style={{ width: '48px', height: '48px' }}>
                  3
                </div>
                <h5 className="fw-bold text-dark mb-2">Track & Ship</h5>
                <p className="text-secondary small mb-0">
                  Move cards across Kanban columns in real-time, collaborate via comments, and hit project deliverables with ease.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-5 py-md-6">
        <div className="container">
          <div className="hero-gradient p-4 p-md-5 text-center text-white shadow-lg rounded-4">
            <h2 className="display-5 fw-bold mb-3 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Ready to supercharge your team's project workflow?
            </h2>
            <p className="lead text-white-50 mx-auto mb-4" style={{ maxWidth: '600px' }}>
              Join forward-thinking product managers, developers, and designers shipping with ProjectManager.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              {isSignedIn ? (
                <Link to="/dashboard" className="btn btn-light btn-lg fw-bold text-primary px-4 py-2.5">
                  Open Your Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/sign-up" className="btn btn-light btn-lg fw-bold text-primary px-4 py-2.5">
                    Get Started Free
                  </Link>
                  <Link to="/sign-in" className="btn btn-outline-light btn-lg fw-semibold px-4 py-2.5">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. PROFESSIONAL FOOTER */}
      <footer className="border-top bg-white text-secondary">
        {/* Footer Main Grid */}
        <div className="container py-5">
          <div className="row g-4">
            {/* Brand Column */}
            <div className="col-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="header-brand-icon" style={{ width: '30px', height: '30px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>space_dashboard</span>
                </div>
                <span className="fw-bold text-dark" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
                  ProjectManager
                </span>
                <span className="header-tag">CodeAlpha</span>
              </div>
              <p className="small text-muted lh-lg mb-3" style={{ maxWidth: '280px' }}>
                A full-stack collaborative workspace built for modern agile product and engineering teams. Powered by React, Express, Clerk, and Supabase.
              </p>
              <div className="d-flex gap-2">
                <Link to="/sign-up" className="btn-saas-primary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
                  Get Started Free
                </Link>
                <Link to="/help" className="btn-saas-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
                  Help Center
                </Link>
              </div>
            </div>

            {/* Product Links */}
            <div className="col-sm-6 col-lg-2">
              <h6 className="fw-bold text-dark text-uppercase small font-mono mb-3">Product</h6>
              <ul className="list-unstyled d-flex flex-column gap-2">
                <li><Link to="/" className="text-secondary text-decoration-none small hover:text-primary">Home</Link></li>
                <li><Link to="/dashboard" className="text-secondary text-decoration-none small hover:text-primary">Dashboard</Link></li>
                <li><Link to="/sign-up" className="text-secondary text-decoration-none small hover:text-primary">Sign Up</Link></li>
                <li><Link to="/sign-in" className="text-secondary text-decoration-none small hover:text-primary">Sign In</Link></li>
              </ul>
            </div>

            {/* Support Links */}
            <div className="col-sm-6 col-lg-2">
              <h6 className="fw-bold text-dark text-uppercase small font-mono mb-3">Support</h6>
              <ul className="list-unstyled d-flex flex-column gap-2">
                <li><Link to="/help" className="text-secondary text-decoration-none small hover:text-primary">Help Center</Link></li>
                <li><Link to="/help#contact-form" className="text-secondary text-decoration-none small hover:text-primary">Contact Us</Link></li>
                <li><Link to="/return-policy" className="text-secondary text-decoration-none small hover:text-primary">Refund Policy</Link></li>
                <li><a href="mailto:support@projectmanager.io" className="text-secondary text-decoration-none small hover:text-primary">Email Support</a></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="col-sm-6 col-lg-2">
              <h6 className="fw-bold text-dark text-uppercase small font-mono mb-3">Legal</h6>
              <ul className="list-unstyled d-flex flex-column gap-2">
                <li><Link to="/privacy-policy" className="text-secondary text-decoration-none small hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="/return-policy" className="text-secondary text-decoration-none small hover:text-primary">Return Policy</Link></li>
                <li><Link to="/help" className="text-secondary text-decoration-none small hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="col-sm-6 col-lg-2">
              <h6 className="fw-bold text-dark text-uppercase small font-mono mb-3">Security</h6>
              <div className="d-flex flex-column gap-2">
                <div className="p-2 bg-success-subtle border border-success border-opacity-25 rounded-2 text-center small">
                  <div className="fw-bold text-success" style={{ fontSize: '0.75rem' }}>✅ 7-Day Refunds</div>
                </div>
                <div className="p-2 bg-primary-subtle border border-primary border-opacity-25 rounded-2 text-center small">
                  <div className="fw-bold text-primary" style={{ fontSize: '0.75rem' }}>🔒 Clerk Auth</div>
                </div>
                <div className="p-2 bg-light border rounded-2 text-center small">
                  <div className="fw-bold text-secondary" style={{ fontSize: '0.75rem' }}>🗄️ AES-256 Encrypted</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="border-top py-3 bg-light">
          <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <div className="text-muted" style={{ fontSize: '0.78rem' }}>
              © {new Date().getFullYear()} ProjectManager. Built for the <strong>CodeAlpha Full-Stack Internship</strong>.
            </div>
            <div className="d-flex gap-3" style={{ fontSize: '0.78rem' }}>
              <Link to="/privacy-policy" className="text-muted text-decoration-none hover:text-primary">Privacy</Link>
              <Link to="/return-policy" className="text-muted text-decoration-none hover:text-primary">Returns</Link>
              <Link to="/help" className="text-muted text-decoration-none hover:text-primary">Help</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
