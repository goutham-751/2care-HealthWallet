import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { FiShield, FiBarChart2, FiShare2, FiUpload, FiHeart, FiLock, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import './LandingPage.css';

function FiActivityIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
    </svg>
  );
}

function FiDropletIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  );
}

const features = [
  { icon: <FiUpload />, title: 'Upload & Organize', desc: 'Store blood tests, X-rays, MRIs, prescriptions — all in one secure vault.' },
  { icon: <FiBarChart2 />, title: 'Track Vitals', desc: 'Log BP, blood sugar, heart rate, SpO2. Visualize trends with interactive charts.' },
  { icon: <FiShare2 />, title: 'Share Securely', desc: 'Share reports with your doctor or family. Grant and revoke access anytime.' },
  { icon: <FiShield />, title: 'Bank-Grade Security', desc: 'Clerk authentication, encrypted storage, role-based access control.' },
];

const stats = [
  { value: '10K+', label: 'Reports Stored' },
  { value: '5K+', label: 'Users Trust Us' },
  { value: '99.9%', label: 'Uptime' },
  { value: '256-bit', label: 'Encryption' },
];

const testimonials = [
  { name: 'Dr. Suresh Rajan', role: 'Cardiologist', text: 'Health Wallet transformed how I access patient records. Instant, secure, and organized.', avatar: 'S' },
  { name: 'Riya Sharma', role: 'Professional', text: 'I manage my parents\' health records too. Having everything in one place saved us during an emergency.', avatar: 'R' },
  { name: 'Arjun Mehta', role: 'Caregiver', text: 'The vitals tracking charts are incredible. I can see my father\'s BP trends at a glance.', avatar: 'A' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-logo">
            <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
              <path d="M16 8C12 8 9 11 9 14.5C9 20 16 25 16 25C16 25 23 20 23 14.5C23 11 20 8 16 8Z" fill="white" opacity="0.9"/>
              <path d="M13 15H15V13H17V15H19V17H17V19H15V17H13V15Z" fill="var(--color-primary)" />
            </svg>
            <span>Health Wallet</span>
          </div>
          <nav className="landing-nav">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#testimonials">Testimonials</a>
          </nav>
          <div className="landing-header-actions">
            <button className="btn btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Started Free</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-bg"><div className="orb orb-1"></div><div className="orb orb-2"></div><div className="orb orb-3"></div></div>
        <div className="landing-hero-content">
          <div className="landing-hero-badge"><FiHeart /> Trusted by 5,000+ users</div>
          <h1>Your Health Records.<br /><span className="hero-gradient-text">Your Terms.</span></h1>
          <p className="landing-hero-subtitle">A secure digital vault for all your medical reports, prescriptions, and vitals. Upload, track trends, and share with your doctors.</p>
          <div className="landing-hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>Create Free Account <FiArrowRight /></button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>Sign In</button>
          </div>
          <div className="landing-hero-trust"><FiLock /><span>End-to-end encrypted · No ads · Your data is never sold</span></div>
        </div>
        <div className="landing-hero-preview">
          <div className="preview-window">
            <div className="preview-titlebar"><div className="preview-dots"><span></span><span></span><span></span></div><span className="preview-url">healthwallet.app/dashboard</span></div>
            <div className="preview-content">
              <div className="preview-sidebar"><div className="preview-sidebar-item active"></div><div className="preview-sidebar-item"></div><div className="preview-sidebar-item"></div></div>
              <div className="preview-main">
                <div className="skeleton" style={{width:'60%',height:'16px',marginBottom:'16px'}}></div>
                <div className="preview-cards">
                  <div className="preview-vital-card"><div className="preview-vital-icon" style={{background:'var(--vital-hr)'}}><FiHeart size={12} color="white"/></div><div className="preview-vital-value">78</div><div className="preview-vital-label">bpm</div></div>
                  <div className="preview-vital-card"><div className="preview-vital-icon" style={{background:'var(--vital-bp)'}}><FiActivityIcon size={12} color="white"/></div><div className="preview-vital-value">118/76</div><div className="preview-vital-label">mmHg</div></div>
                  <div className="preview-vital-card"><div className="preview-vital-icon" style={{background:'var(--vital-sugar)'}}><FiDropletIcon size={12} color="white"/></div><div className="preview-vital-value">92</div><div className="preview-vital-label">mg/dL</div></div>
                </div>
                <div className="preview-chart">
                  <svg viewBox="0 0 300 80" className="preview-chart-svg">
                    <defs><linearGradient id="cG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2"/><stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0"/></linearGradient></defs>
                    <path d="M0,60 Q30,40 60,45 T120,35 T180,50 T240,30 T300,40 V80 H0 Z" fill="url(#cG)"/>
                    <path d="M0,60 Q30,40 60,45 T120,35 T180,50 T240,30 T300,40" fill="none" stroke="var(--color-primary)" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="landing-stats">{stats.map((s,i)=>(<div key={i} className="landing-stat"><span className="landing-stat-value">{s.value}</span><span className="landing-stat-label">{s.label}</span></div>))}</section>

      {/* Features */}
      <section className="landing-features" id="features">
        <div className="landing-section-header"><h2>Everything You Need</h2><p>One platform to store, track, and share your health history</p></div>
        <div className="landing-features-grid">{features.map((f,i)=>(<div key={i} className="landing-feature-card card card-hover"><div className="landing-feature-icon">{f.icon}</div><h4>{f.title}</h4><p>{f.desc}</p></div>))}</div>
      </section>

      {/* How It Works */}
      <section className="landing-how" id="how-it-works">
        <div className="landing-section-header"><h2>Simple as 1-2-3</h2><p>Get started in minutes, not hours</p></div>
        <div className="landing-steps">
          <div className="landing-step"><div className="landing-step-number">1</div><h4>Create Account</h4><p>Sign up free. Your secure vault is ready instantly.</p></div>
          <div className="landing-step-arrow">→</div>
          <div className="landing-step"><div className="landing-step-number">2</div><h4>Upload & Log</h4><p>Upload PDFs, images. Log vitals like BP, sugar, heart rate.</p></div>
          <div className="landing-step-arrow">→</div>
          <div className="landing-step"><div className="landing-step-number">3</div><h4>Track & Share</h4><p>View trends. Share reports securely with doctors or family.</p></div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="landing-testimonials" id="testimonials">
        <div className="landing-section-header"><h2>Loved by Users & Doctors</h2><p>See what our community says</p></div>
        <div className="landing-testimonials-grid">{testimonials.map((t,i)=>(<div key={i} className="landing-testimonial card"><p className="testimonial-text">"{t.text}"</p><div className="testimonial-author"><div className="testimonial-avatar">{t.avatar}</div><div><div className="testimonial-name">{t.name}</div><div className="testimonial-role">{t.role}</div></div></div></div>))}</div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="landing-cta-content">
          <h2>Take Control of Your Health Data</h2>
          <p>Join thousands who trust Health Wallet with their medical records.</p>
          <div className="landing-cta-features"><span><FiCheckCircle /> Free forever</span><span><FiCheckCircle /> No credit card</span><span><FiCheckCircle /> Setup in 2 min</span></div>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>Get Started — It's Free <FiArrowRight /></button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <div className="landing-logo"><svg viewBox="0 0 32 32" fill="none" width="28" height="28"><rect width="32" height="32" rx="8" fill="var(--color-primary)"/><path d="M16 8C12 8 9 11 9 14.5C9 20 16 25 16 25C16 25 23 20 23 14.5C23 11 20 8 16 8Z" fill="white" opacity="0.9"/><path d="M13 15H15V13H17V15H19V17H17V19H15V17H13V15Z" fill="var(--color-primary)"/></svg><span>Health Wallet</span></div>
            <p>Your personal health companion.</p>
          </div>
          <div className="landing-footer-links">
            <div><h5>Product</h5><a href="#features">Features</a><a href="#how-it-works">How It Works</a></div>
            <div><h5>Company</h5><a href="#">About 2care.ai</a><a href="#">Privacy Policy</a></div>
          </div>
        </div>
        <div className="landing-footer-bottom"><p>© 2026 Health Wallet by 2care.ai. All rights reserved.</p></div>
      </footer>
    </div>
  );
}
