import { NavLink } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { FiHome, FiFileText, FiActivity, FiUsers, FiLogOut, FiUser } from 'react-icons/fi';
import './Sidebar.css';

export default function Sidebar() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/reports', label: 'Reports', icon: FiFileText },
    { path: '/vitals', label: 'Vitals', icon: FiActivity },
    { path: '/shared', label: 'Shared', icon: FiUsers },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
              <path d="M16 8C12 8 9 11 9 14.5C9 20 16 25 16 25C16 25 23 20 23 14.5C23 11 20 8 16 8Z" fill="white" opacity="0.9"/>
              <path d="M13 15H15V13H17V15H19V17H17V19H15V17H13V15Z" fill="var(--color-primary)" />
            </svg>
          </div>
          <span className="sidebar-logo-text">Health Wallet</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="sidebar-link-icon"><item.icon /></span>
            <span className="sidebar-link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="sidebar-link-icon"><FiUser /></span>
          <span className="sidebar-link-label">Profile</span>
        </NavLink>
        <button className="sidebar-link sidebar-logout" onClick={() => signOut()}>
          <span className="sidebar-link-icon"><FiLogOut /></span>
          <span className="sidebar-link-label">Logout</span>
        </button>
        
        {user && (
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{user.fullName?.charAt(0) || 'U'}</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user.fullName}</span>
              <span className="sidebar-user-email">{user.primaryEmailAddress?.emailAddress}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
