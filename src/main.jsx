import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WebApp from '@twa-dev/sdk'
import './index.css'
import App from './App.jsx'

// Initialize Telegram Mini App
try {
  WebApp.ready();
  WebApp.expand();
} catch (e) {
  console.log("Not running in Telegram Mini App environment");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
