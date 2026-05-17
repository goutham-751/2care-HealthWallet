import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { setAuthTokenGetter } from '../../api/axios';
import './AppLayout.css';

export default function AppLayout() {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(getToken);
    return () => setAuthTokenGetter(null);
  }, [getToken]);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="app-content">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
