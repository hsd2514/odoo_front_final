import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ShopProvider from './context/ShopContext'
import Toast from './components/Toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShopProvider>
      <App />
      <Toast />
    </ShopProvider>
  </StrictMode>,
)
