import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  const errorMessage = import.meta.env.DEV
    ? 'Missing VITE_CLERK_PUBLISHABLE_KEY in .env file. Please add your Clerk Publishable Key.'
    : 'Authentication configuration error. Please contact support.'
  throw new Error(errorMessage)
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error(
    'Failed to find the root element. Please ensure index.html contains a div with id="root".'
  )
}

createRoot(rootElement).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/onboarding"
    >
      <App />
    </ClerkProvider>
  </StrictMode>
)
