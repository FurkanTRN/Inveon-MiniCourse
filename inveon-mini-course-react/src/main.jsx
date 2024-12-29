import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";
import {CartProvider} from "./context/CartContext.jsx";
import {ToastProvider} from "./context/ToastContext.jsx";
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ToastProvider>
          <CartProvider>
              <App />
          </CartProvider>
      </ToastProvider>
  </StrictMode>,
)
