import {StrictMode} from 'react'
import App from './App.tsx'
import './index.css'
import {createRoot} from 'react-dom/client'
import {CartProvider} from "./context/cartContext.tsx";
import {GeneralStateProvider} from "./context/generalStateContext.tsx";
import {BrowserRouter as Router} from 'react-router-dom';


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GeneralStateProvider>
            <CartProvider>
                <Router>
                    <App/>
                </Router>
            </CartProvider>
        </GeneralStateProvider>
    </StrictMode>,
)
