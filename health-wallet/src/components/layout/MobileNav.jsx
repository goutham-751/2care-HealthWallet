import { NavLink } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { FiHome, FiFileText, FiActivity, FiUsers, FiUser, FiLogOut } from 'react-icons/fi';
import './MobileNav.css';

export default function MobileNav() {
  const { signOut } = useAuth();

  const tabs = [
    { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/reports', icon: <FiFileText />, label: 'Reports' },
    { to: '/vitals', icon: <FiActivity />, label: 'Vitals' },
    { to: '/shared', icon: <FiUsers />, label: 'Shared' },
  ];

  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-tabs">
        {tabs.slice(0, 2).map(tab => (
          <NavLink key={tab.to} to={tab.to} className={({ isActive }) => `mobile-nav-tab ${isActive ? 'active' : ''}`}>
            <span className="mobile-nav-tab-icon">{tab.icon}</span>
            <span className="mobile-nav-tab-label">{tab.label}</span>
          </NavLink>
        ))}

        <NavLink to="/profile" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <FiUser className="mobile-nav-icon" />
          <span>Profile</span>
        </NavLink>

        <button className="mobile-nav-item mobile-logout" onClick={() => signOut()}>
          <FiLogOut className="mobile-nav-icon" />
          <span>Logout</span>
        </button>

        {tabs.slice(2).map(tab => (
          <NavLink key={tab.to} to={tab.to} className={({ isActive }) => `mobile-nav-tab ${isActive ? 'active' : ''}`}>
            <span className="mobile-nav-tab-icon">{tab.icon}</span>
            <span className="mobile-nav-tab-label">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
