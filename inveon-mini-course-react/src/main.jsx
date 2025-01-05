import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";
import {CartProvider} from "./context/CartContext.jsx";
import {ToastProvider} from "./context/ToastContext.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
      <ToastProvider>
          <CartProvider>
              <App />
          </CartProvider>
      </ToastProvider>
      </AuthProvider>
  </StrictMode>,
)
