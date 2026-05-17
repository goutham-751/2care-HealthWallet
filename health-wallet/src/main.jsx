import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    ) : (
      <div style={{ padding: '2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <h1>Health Wallet cannot start</h1>
        <p>Missing <code>VITE_CLERK_PUBLISHABLE_KEY</code> in <code>health-wallet/.env</code>.</p>
      </div>
    )}
  </StrictMode>,
)
