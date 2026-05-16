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
          <svg viewBox="0 0 32 32" fill="none" width="24" height="24">
            <rect width="32" height="32" rx="8" fill="var(--color-primary)"/>
            <path d="M16 8C12 8 9 11 9 14.5C9 20 16 25 16 25C16 25 23 20 23 14.5C23 11 20 8 16 8Z" fill="white"/>
            <path d="M13 15H15V13H17V15H19V17H17V19H15V17H13V15Z" fill="var(--color-primary)"/>
          </svg>
        </div>
        <span>Health Wallet</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <item.icon className="nav-icon" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiUser className="nav-icon" />
          <span>Profile</span>
        </NavLink>
        <button className="nav-item btn-logout" onClick={() => signOut()}>
          <FiLogOut className="nav-icon" />
          <span>Logout</span>
        </button>
        
        {user && (
          <div className="sidebar-user">
            <div className="user-avatar">{user.fullName?.charAt(0) || 'U'}</div>
            <div className="user-info">
              <span className="user-name">{user.fullName}</span>
              <span className="user-email">{user.primaryEmailAddress?.emailAddress}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
