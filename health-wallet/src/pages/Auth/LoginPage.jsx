import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './AuthPages.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      setShake(true);
      setTimeout(() => setShake(false), 300);
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
    setLoading(false);
  };

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
        <div className={`auth-form-card ${shake ? 'animate-shake' : ''}`}>
          <h2>Welcome back</h2>
          <p className="auth-form-subtitle">Sign in to access your health records</p>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="login-email">Email address</label>
              <div className="input-icon-wrap">
                <FiMail className="input-icon" />
                <input id="login-email" type="email" className="input input-with-icon" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-icon-wrap">
                <FiLock className="input-icon" />
                <input id="login-password" type={showPassword ? 'text' : 'password'} className="input input-with-icon" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEyeOff /> : <FiEye />}</button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <><span className="spinner"></span> Signing in...</> : 'Sign In'}
            </button>
          </form>
          <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}
