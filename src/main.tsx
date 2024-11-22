import {StrictMode} from 'react'
import App from './App.tsx'
import './index.css'
import {createRoot} from 'react-dom/client'
import {CartProvider} from "./context/cartContext.tsx";
import {GeneralStateProvider} from "./context/generalStateContext.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GeneralStateProvider>
            <CartProvider>
                <App/>
            </CartProvider>
        </GeneralStateProvider>
    </StrictMode>,
)
