import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@fontsource/jetbrains-mono';
import '@fontsource/shippori-mincho';
import '@fontsource/zen-kaku-gothic-new';
import './i18n/config'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
