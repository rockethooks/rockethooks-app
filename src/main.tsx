import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find the root element. Please ensure index.html contains a div with id="root".')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)