import React, {useEffect, useRef, useState} from 'react';
import './clientDetailsPage.css';
import {googleLogo} from "../../assets";
import {NavLink} from 'react-router-dom';
import {ICartItem, useCart} from "../../context/cartContext.tsx";
import {GeneralStateContextType, useGeneralStateContext} from "../../context/generalStateContext.tsx";
import {ThreeDots} from "react-loader-spinner";
import ArrowIcon from "../../componentsReusable/arrowIcon/arrowIcon.tsx";
import {FcCheckmark} from "react-icons/fc";
import {Helmet} from "react-helmet";
import {determinePrice} from "../../../shared/determine-price.ts";

export interface IAddress {
    city: string;
    street: string;
    houseNum: string;
    apartmentNum?: string;
    zipCode: string;
}

export interface IClientDetails {
    name: string;
    emails: string[];
    address: IAddress;
    phone: string;
}

type TPaymentDetailsItem = {
    description: string;
    quantity: number;
    price: number;
    currency: 'ILS';
    vatType: 0;
}

export interface IPaymentDetails {
    amount: number;
    client: IClientDetails;
    income: TPaymentDetailsItem[];
    cart: ICartItem[];
    totalQuantityInCart: number;
    couponCode: string;
}

function validateFormFields(paymentDetails: IPaymentDetails, policyAgreement: boolean, generalContext: GeneralStateContextType): {
    field: number,
    status: boolean,
    message: string
} {

    const {income, client} = paymentDetails;
    const {city, street, houseNum, zipCode} = paymentDetails.client.address;

    if (income.length <= 0) return {field: 1, status: false, message: generalContext.t('clientDetailsPage.message1')};
    if (client.name === '') return {field: 2, status: false, message: generalContext.t('clientDetailsPage.message2')};
    if (client.emails[0] === '') return {
        field: 3,
        status: false,
        message: generalContext.t('clientDetailsPage.message3')
    };
    if (client.phone === '') return {field: 4, status: false, message: generalContext.t('clientDetailsPage.message4')};
    if (city === '' || street === '' || houseNum === '' || zipCode === '') return {
        field: 5,
        status: false,
        message: generalContext.t('clientDetailsPage.message5')
    };
    if (!policyAgreement) return {field: 6, status: false, message: generalContext.t('clientDetailsPage.message6')};

    return {field: 0, status: true, message: ''};
}

const ClientDetailsFormPage: React.FC = () => {

    const generalContext = useGeneralStateContext();

    const addressDetailsDefaultVal = {
        zipCode: '',
        city: '',
        houseNum: '',
        street: '',
        apartmentNum: ''
    };

    const searchDebounceTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);

    // get search results from the Google Address Autocomplete API and display them as suggestions under the address input for the user to choose from.
    const [addressSearchResults, setAddressSearchResults] = useState<string[]>([]);
    // the value to show in the input as the user type
    const [addressInput, setAddressInput] = useState('');
    // collect all the details to send them to the server
    const [addressDetails, setAddressDetails] = useState<IAddress>(addressDetailsDefaultVal);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [policyAgreement, setPolicyAgreement] = useState(false);

    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState<number | null>(null);
    const [couponMessage, setCouponMessage] = useState<{ message: string; color: 'red' | 'black' } | null>(null);

    const [showMessage, setShowMessage] = useState<null | string>(null);
    const [inValidField, setInValidField] = useState<null | number>(null);
    const [loading, setLoading] = useState(false);
    const [couponLoading, setCouponLoading] = useState(false);

    const cartContext = useCart();
    const cartItems = cartContext.cart;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setShowMessage(null);
        setLoading(true);
        scrollTo('down');

        // prepare the payment details that should be sent to create the payment form in the server

        // PRODUCTS DETAILS
        const income: TPaymentDetailsItem[] = cartItems.map(book => {
            return {
                description: `${book.title} / ${book.coverType === 'hard-cover' ? 'כריכה קשה' : 'כריכה רכה'}`,
                quantity: book.quantity,
                price: determinePrice(book.coverType, cartContext.totalQuantityInCart, discount),
                currency: 'ILS',
                vatType: 0
            };
        });

        // CLIENT ADDRESS AND DETAILS
        const client: IClientDetails = {
            address: addressDetails,
            emails: [email],
            name,
            phone,
        }

        // PAYMENT DETAILS - pack all the information to one object that will be sent to the server
        const paymentDetails: IPaymentDetails = {
            amount: cartContext.discountCouponPrice || cartContext.totalPrice,
            client,
            income,
            cart: cartContext.cart,
            totalQuantityInCart: cartContext.totalQuantityInCart,
            couponCode,
        }

        const {field, status, message} = validateFormFields(paymentDetails, policyAgreement, generalContext);
        if (status) {

            try {
                // fetching the payment form (credit card form details) from "Morning API"
                const getPaymentFormResponse = await fetch('.netlify/functions/get-payment-form', {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(paymentDetails),
                });


                const paymentForm = await getPaymentFormResponse.json();

                // navigate to the payment form url if the fetch was success and show error if something went wrong
                if (paymentForm.success) {
                    window.location.href = paymentForm.url;
                } else {
                    setLoading(false);

                    if (paymentForm.errorMessage === 'לא נשלח שם וטלפון או שאינו תקין') {
                        setInValidField(4);
                        scrollTo('up');
                    }

                    setShowMessage(paymentForm.errorMessage || paymentForm.message);
                }
            } catch (err) {
                console.error(err);
                setLoading(false);
                setShowMessage('משהו השתבש :(');
            }

        } else {
            setLoading(false);
            setShowMessage(message);
            setInValidField(field);
            scrollTo('up');
        }
    }

    // Use Google Address Autocomplete API to display address suggestions for user selection
    const getGoogleAutoCompleteAddressInCity = async (searchVal: string) => {

        try {
            const response = await fetch(`.netlify/functions/get-address?query=${searchVal}`);

            const addresses = await response.json();

            setAddressSearchResults(addresses);
        } catch (err) {
            console.error(err);
        }
    }

    // set the address that has been chosen from the suggested list from the Google auto complete API in the input
    const handleAddressChoice = (addressFromListResults: string): void => {
        setAddressInput(addressFromListResults);

        // peek the city and street from the results-string and set them as the user address
        const removeNumbers = addressFromListResults.replace(/[0-9]/g, '');
        const arrayFromAddress = removeNumbers.split(',');

        const street = arrayFromAddress[0].trim();
        const city = arrayFromAddress[1].trim();

        setAddressDetails(prevState => ({...prevState, street, city}));

        // Clear the search results and hide the suggestion list.
        setAddressSearchResults([]);
    }

    // Check the validation of the Coupon-Code and give the discount if found valid
    const handleCouponCode = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
        e.preventDefault();
        setCouponLoading(true);

        try {
            const couponResponse = await fetch(`.netlify/functions/get-coupon?code=${couponCode}`, {
                method: 'get',
            });

            if (couponResponse.ok) {
                const couponCodeResults: string = await couponResponse.json();
                if (typeof +couponCodeResults === 'number') {
                    setDiscount(+couponCodeResults);
                    setCouponMessage({
                        message: `${generalContext.t('clientDetailsPage.messageCoupon')}${couponCodeResults}%`,
                        color: 'black',
                    });
                    cartContext.discountTotalPrice(+couponCodeResults);
                }
            } else {
                setCouponMessage({
                    message: generalContext.t('clientDetailsPage.messageCouponError'),
                    color: 'red'
                });
                console.error(`Response is: ${couponResponse.status} Coupon not found`);
            }
            setCouponLoading(false);
        } catch (err) {
            console.log(err);
            setCouponLoading(false);
        }
    }

    // Make sure that the user start from the top of the page as user navigate to the page
    useEffect(() => {
        scrollTo('up');
    }, []);

    // scroll down as the user clicks the "submit" button
    function scrollTo(direction: 'up' | 'down') {

        const submitButton = document.querySelector('button[type="submit"].reusable-control-btn');
        const rootElement = document.getElementById('root');

        if (submitButton && direction === 'down') {
            submitButton.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
        if (rootElement && direction === 'up') {
            rootElement.scrollTo({top: 0, behavior: 'smooth'});
        }
    }

    // delay the address search function by 500 ms to minimize API calls.
    // the function will only be called if the user pauses typing for at least 500 ms.
    function searchDebounceWrapper(searchValue: string, handleSearchCB: (searchVal: string) => Promise<void>): void {

        if (searchDebounceTimeoutIdRef.current) {
            clearTimeout(searchDebounceTimeoutIdRef.current)
        }

        searchDebounceTimeoutIdRef.current = setTimeout(() => {
            handleSearchCB(searchValue).then();
        }, 400);
    }

    function phoneClassName(): string {
        let className = '';
        if (inValidField === 4 && generalContext.language === 'he') className = 'highlight-invalid-red he';
        if (inValidField === 4) className = 'highlight-invalid-red';
        if (generalContext.language === 'he') className = 'he';

        return className;
    }

    function inputLimiter(limit: number, value: string, cb: (val: string) => void): void {
        if (value === '' || Number(value) >= limit) {
            cb(value);
        }
    }

    return (
        <div className="client-details-page">
            <Helmet>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>

            <div className="back-to-cart-btn-container">
                <NavLink to="/cart-page" className="reusable-control-btn">
                    <ArrowIcon arrowDirection={'R'}/>
                    {generalContext.t('clientDetailsPage.backToCart')}
                </NavLink>
            </div>

            {
                showMessage &&
                <p className="error-message">{showMessage}</p>
            }
            <form onSubmit={handleSubmit}>
                <div className="form-container">

                    <div className="client-details">
                        <h3>{generalContext.t('clientDetailsPage.clientDetails')}</h3>

                        <label>
                            {generalContext.t('clientDetailsPage.name')}:
                            <input
                                className={inValidField === 2 ? 'highlight-invalid-red' : ''}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder={generalContext.t('clientDetailsPage.namePlaceholder')}
                                autoComplete="name"
                            />
                        </label>
                        <label>
                            {generalContext.t('clientDetailsPage.email')}:
                            <input
                                className={inValidField === 3 ? 'highlight-invalid-red' : ''}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder={generalContext.t('clientDetailsPage.emailPlaceholder')}
                                autoComplete="email"
                            />
                        </label>
                        <label>
                            {generalContext.t('clientDetailsPage.phone')}:
                            <input
                                className={phoneClassName()}
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                placeholder={generalContext.t('clientDetailsPage.phonePlaceholder')}
                                autoComplete="tel"
                            />
                        </label>
                    </div>

                    <div className="client-address">
                        <h3>{generalContext.t('clientDetailsPage.shippingAddress')}</h3>

                        <label>
                            {generalContext.t('clientDetailsPage.shippingAddress')}:
                            <input
                                className={inValidField === 5 ? 'address-input highlight-invalid-red' : 'address-input'}
                                type="text"
                                value={addressInput}
                                onChange={(e) => {
                                    setAddressInput(e.target.value);
                                    searchDebounceWrapper(e.target.value, getGoogleAutoCompleteAddressInCity);
                                }}
                                required
                                placeholder={generalContext.t('clientDetailsPage.addressPlaceholder')}
                            />
                            {
                                addressSearchResults && addressSearchResults.length > 0 &&
                                <ul>
                                    {
                                        addressSearchResults.map(address =>
                                            <li
                                                key={address}
                                                onClick={() => handleAddressChoice(address)}
                                            >{address}</li>
                                        )
                                    }
                                </ul>
                            }
                            <img className="google-logo" src={googleLogo} alt="google logo in color"/>
                        </label>
                        <label className="house-number-input">
                            {generalContext.t('clientDetailsPage.houseNumber')}:
                            <input
                                className={inValidField === 5 ? 'highlight-invalid-red' : ''}
                                type="number"
                                value={addressDetails.houseNum}
                                onChange={(e) => {
                                    inputLimiter(1, e.target.value, (value) =>
                                        setAddressDetails(prevState => ({...prevState, houseNum: value})));
                                }}
                                required
                                placeholder={generalContext.t('clientDetailsPage.houseNumberPlaceholder')}
                            />
                        </label>
                        <label>
                            {generalContext.t('clientDetailsPage.apartmentNumber')}:
                            <input
                                type="number"
                                value={addressDetails.apartmentNum}
                                onChange={(e) => {
                                    inputLimiter(1, e.target.value, (value) =>
                                        setAddressDetails(prevState => ({...prevState, apartmentNum: value})));
                                }}
                                placeholder={generalContext.t('clientDetailsPage.apartmentNumberPlaceholder')}
                            />
                        </label>
                        <label>
                            {generalContext.t('clientDetailsPage.zipCode')}:
                            <input
                                className={inValidField === 5 ? 'highlight-invalid-red' : ''}
                                type="number"
                                value={addressDetails.zipCode}
                                onChange={(e) => {
                                    inputLimiter(0, e.target.value, (value) =>
                                        setAddressDetails(prevState => ({...prevState, zipCode: value})));
                                }}
                                required
                                placeholder={generalContext.t('clientDetailsPage.zipCodePlaceholder')}
                                autoComplete="postal-code"
                            />
                        </label>
                    </div>
                    <div className="coupon-section">
                        <label onClick={() => setCouponMessage(null)}>
                            {generalContext.t('clientDetailsPage.couponCode')}
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                        </label>
                        <button className="reusable-control-btn" onClick={handleCouponCode}>
                            {
                                !couponLoading ?
                                    <FcCheckmark/>
                                    :
                                    <ThreeDots
                                        visible={true}
                                        height="35"
                                        width="35"
                                        color="#3f3fbf"
                                        radius="9"
                                        ariaLabel="three-dots-loading"
                                    />}
                        </button>
                        {
                            couponMessage &&
                            <p className="coupon-message"
                               style={{color: couponMessage.color}}>{couponMessage.message}</p>
                        }
                    </div>
                </div>
                <div
                    className="client-details-total-price">{generalContext.t('clientDetailsPage.totalPrice')}: {cartContext.discountCouponPrice || cartContext.totalPrice} ₪
                </div>
                <div className="policy-agreement">
                    <p>{generalContext.t('clientDetailsPage.deliveryNotice')}</p>
                    <label className="policy-agreement-checkbox">
                        <input
                            className={inValidField === 6 ? 'highlight-invalid-red' : ''}
                            type="checkbox"
                            required
                            checked={policyAgreement}
                            onChange={() => setPolicyAgreement(!policyAgreement)}
                        />
                        {generalContext.t('clientDetailsPage.policyAgreement')}
                    </label>
                    <NavLink className="site-policy-link"
                             to={'/policy-page'}>{generalContext.t('clientDetailsPage.policyPage')}</NavLink>
                </div>

                <button className="reusable-control-btn" type="submit" disabled={addressSearchResults.length > 0}>
                    {
                        !loading &&
                        <>
                            {generalContext.t('clientDetailsPage.submit')}
                            <ArrowIcon arrowDirection={'L'}/>
                        </>
                    }
                    {
                        loading &&
                        <ThreeDots
                            visible={true}
                            height="35"
                            width="35"
                            color="#3f3fbf"
                            radius="9"
                            ariaLabel="three-dots-loading"
                        />
                    }
                </button>
                {
                    showMessage &&
                    <p className="error-message">{showMessage}</p>
                }
            </form>
        </div>
    );
};

export default ClientDetailsFormPage;
