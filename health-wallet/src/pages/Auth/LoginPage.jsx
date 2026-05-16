import { SignIn } from '@clerk/clerk-react';
import './AuthPages.css';

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-brand-logo">
            <svg viewBox="0 0 32 32" fill="none" width="40" height="40">
              <rect width="32" height="32" rx="8" fill="white" opacity="0.2"/>
              <path d="M16 8C12 8 9 11 9 14.5C9 20 16 25 16 25C16 25 23 20 23 14.5C23 11 20 8 16 8Z" fill="white" opacity="0.9"/>
              <path d="M13 15H15V13H17V15H19V17H17V19H15V17H13V15Z" fill="var(--color-primary)"/>
            </svg>
          </div>
          <h1>Health Wallet</h1>
          <p className="auth-brand-tagline">Your records. Your terms.</p>
          <div className="auth-brand-ecg">
            <svg viewBox="0 0 400 60" fill="none" style={{width:'100%',opacity:0.15}}>
              <path d="M0,30 L80,30 L100,10 L120,50 L140,20 L160,40 L180,30 L400,30" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <div className="auth-brand-quote">
            <p>"The best health app I've ever used. Everything in one place."</p>
            <span>— Dr. Suresh Rajan, Cardiologist</span>
          </div>
        </div>
      </div>
      <div className="auth-form-panel">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '2rem' }}>
          <SignIn routing="path" path="/login" signUpUrl="/register" forceRedirectUrl="/dashboard" />
        </div>
      </div>
    </div>
  );
}
