import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiFileText, FiActivity, FiUsers, FiPlus } from 'react-icons/fi';
import './MobileNav.css';

export default function MobileNav() {
  const navigate = useNavigate();

  const tabs = [
    { to: '/dashboard', icon: <FiGrid />, label: 'Dashboard' },
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

        <button className="mobile-nav-fab" onClick={() => navigate('/reports/upload')}>
          <FiPlus />
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
