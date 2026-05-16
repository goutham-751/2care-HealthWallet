import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiFileText, FiActivity, FiUsers, FiUser, FiLogOut, FiUpload } from 'react-icons/fi';
import './Sidebar.css';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: <FiGrid />, label: 'Dashboard' },
    { to: '/reports', icon: <FiFileText />, label: 'Reports' },
    { to: '/vitals', icon: <FiActivity />, label: 'Vitals' },
    { to: '/shared', icon: <FiUsers />, label: 'Shared' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate('/dashboard')}>
        <div className="sidebar-logo-icon">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
            <path d="M16 8C12 8 9 11 9 14.5C9 20 16 25 16 25C16 25 23 20 23 14.5C23 11 20 8 16 8Z" fill="white" opacity="0.9"/>
            <path d="M13 15H15V13H17V15H19V17H17V19H15V17H13V15Z" fill="var(--color-primary)" />
          </svg>
        </div>
        <span className="sidebar-logo-text">Health Wallet</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span className="sidebar-link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-upload-btn btn btn-primary btn-full" onClick={() => navigate('/reports/upload')}>
        <FiUpload /> Upload Report
      </button>

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="sidebar-link-icon"><FiUser /></span>
          <span className="sidebar-link-label">Profile</span>
        </NavLink>
        <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-link-icon"><FiLogOut /></span>
          <span className="sidebar-link-label">Logout</span>
        </button>
      </div>

      {user && (
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{user.name?.charAt(0)}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user.name}</span>
            <span className="sidebar-user-email">{user.email}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
