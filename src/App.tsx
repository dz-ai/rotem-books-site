import React, {useEffect} from 'react';
import './App.css';
import {Route, Routes, useLocation} from 'react-router-dom';
import Header from './components/header/header.tsx';
import Footer from './components/footer/footer.tsx';
import HomePage from './pages/homePage/homePage.tsx';
import BookDetailPage from "./pages/bookDetailsPage/booksDetailsPage.tsx";
import CartPage from "./pages/cartPage/cartPage.tsx";
import AboutPage from "./pages/aboutPage/aboutPage.tsx";
import ContactPage from "./pages/contactPage/contactPage.tsx";
import ClientDetailsFormPage from "./pages/clientDetailsPage/clientDetailsPage.tsx";
import PaymentSuccessPage from "./pages/paymentSuccessFailure/paymentSuccessPage.tsx";
import PaymentFailurePage from "./pages/paymentSuccessFailure/paymentFailurePage.tsx";
import BackOfficePage from "./pages/backOffice/backOfficePage.tsx";
import PricingPage from "./pages/pricingPage/pricingPage.tsx";
import LoginPage from "./pages/loginPage/loginPage.tsx";
import PrivateRoute from "./components/protected-route/protectedRoute.tsx";
import PolicyPage from "./pages/policyPage/policyPage.tsx";
import {useGeneralStateContext} from "./context/generalStateContext.tsx";
import {BackOfficeCodeCouponPage} from "./pages/backOffice/backOfficeCodeCouponPage.tsx";
import {NotFoundPage} from "./pages/notFoundPage/notFoundPage.tsx";

export enum ECoverTypeHard {
    basicPrise = 70,
    discountPrise = 60,
}

export enum ECoverTypeSoft {
    basicPrise = 40,
    towBooksPrise = 35,
    threeBooksPrise = 30,
    discountPrise = 25,
}

// TODO create loader component
const App: React.FC = () => {

    const generalContext = useGeneralStateContext();

    useEffect(() => {
        generalContext.checkAuthentication().then();
    }, []);

    const location = useLocation();

    useEffect(() => {
        const mainElement = document.querySelector('#root');
        mainElement &&
        mainElement.scrollTo({top: 0, behavior: 'smooth'});
    }, [location.pathname]);

    return (
        <div className="app" style={{direction: generalContext.language === 'he' ? 'rtl' : 'ltr'}}>
            <Header/>
            <main>
                <Routes>
                    <Route path="/" element={<HomePage/>} index/>
                    <Route path="/book-details/:id" element={<BookDetailPage books={generalContext.books}/>}/>
                    <Route path="/cart-page" element={<CartPage/>}/>
                    <Route path="/about" element={<AboutPage/>}/>
                    <Route path="/pricing" element={<PricingPage/>}/>
                    <Route path="/policy-page" element={<PolicyPage/>}/>
                    <Route path="/contact-page" element={<ContactPage/>}/>
                    <Route path="/client-details-page" element={<ClientDetailsFormPage/>}/>
                    <Route path="/payment-success-page" element={<PaymentSuccessPage/>}/>
                    <Route path="/payment-failure-page" element={<PaymentFailurePage/>}/>
                    <Route element={<PrivateRoute/>}>
                        <Route path="/back-office-page" element={<BackOfficePage/>}/>
                        <Route path="/back-office-code-coupon" element={<BackOfficeCodeCouponPage/>}/>
                    </Route>
                    <Route path="/login-page" element={<LoginPage/>}/>

                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </main>
            <Footer/>
        </div>
    );
}

export default App;
