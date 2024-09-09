import {StrictMode} from 'react'
import App from './App.tsx'
import './index.css'
import {createRoot} from 'react-dom/client'
import {CartProvider} from "./context/cartContext.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CartProvider>
            <App/>
        </CartProvider>
    </StrictMode>,
)
