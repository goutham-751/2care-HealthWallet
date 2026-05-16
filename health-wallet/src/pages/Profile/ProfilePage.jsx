import { useUser, useAuth } from '@clerk/clerk-react';
import { formatDate } from '../../utils/formatters';
import { FiMail, FiCalendar, FiLogOut } from 'react-icons/fi';

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <div className="page-enter" style={{maxWidth:500}}>
      <h1 style={{marginBottom:24}}>Profile</h1>
      <div className="card card-lg">
        <div style={{display:'flex',alignItems:'center',gap:20,marginBottom:28}}>
          <div style={{width:64,height:64,borderRadius:'50%',background:'var(--color-primary)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'var(--text-2xl)',fontWeight:700}}>
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 style={{marginBottom:4}}>{user?.fullName || 'User'}</h3>
            <span style={{color:'var(--color-text-muted)',fontSize:'var(--text-sm)'}}>Owner</span>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{display:'flex',alignItems:'center',gap:12,fontSize:'var(--text-sm)'}}>
            <FiMail style={{color:'var(--color-text-muted)'}} />
            <span style={{color:'var(--color-text-secondary)'}}>Email</span>
            <span style={{marginLeft:'auto',fontWeight:500}}>{user?.primaryEmailAddress?.emailAddress || '—'}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:12,fontSize:'var(--text-sm)'}}>
            <FiCalendar style={{color:'var(--color-text-muted)'}} />
            <span style={{color:'var(--color-text-secondary)'}}>Member since</span>
            <span style={{marginLeft:'auto',fontWeight:500}}>{user?.createdAt ? formatDate(user.createdAt) : '—'}</span>
          </div>
        </div>
        <button className="btn btn-danger btn-full" style={{marginTop:28}} onClick={() => signOut()}><FiLogOut /> Log Out</button>
      </div>
    </div>
  );
}
