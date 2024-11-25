import React, {useEffect, useRef, useState} from 'react';
import './clientDetailsPage.css';
import {googleLogo} from "../../assets";
import {NavLink} from 'react-router-dom';
import {useCart} from "../../context/cartContext.tsx";
import {MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight} from "react-icons/md";
import {ThreeDots} from "react-loader-spinner";

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
}

const ClientDetailsFormPage: React.FC = () => {

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

    const [showMessage, setShowMessage] = useState<null | string>(null);
    const [loading, setLoading] = useState(false);

    const cartContext = useCart();
    const cartItems = cartContext.cart;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setLoading(true);

        scrollToSubmitBtn();

        // prepare the payment details that should be sent to create the payment form in the server
        // TOTAL PRICE
        const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        // PRODUCTS DETAILS
        const income: TPaymentDetailsItem[] = cartItems.map(book => {
            return {
                description: `${book.title} / ${book.coverType === 'hard-cover' ? 'כריכה קשה' : 'כריכה רכה'}`,
                quantity: book.quantity,
                price: book.price,
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
            amount: totalPrice,
            client,
            income,
        }

        if (name && email && checkAddressDetails() && phone && totalPrice && income.length >= 0) {

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
                    setShowMessage(paymentForm.errorMessage);
                }
            } catch (err) {
                console.log(err);
                setLoading(false);
                setShowMessage('משהו השתבש :(');
            }

        } else {
            setLoading(false);
            if (income.length === 0) setShowMessage('עגלת הקניות ריקה מפריטים');
            else setShowMessage('נא למלא את כל הפרטים');
        }
    }

    // Use Google Address Autocomplete API to display address suggestions for user selection
    const getGoogleAutoCompleteAddressInCity = async (searchVal: string) => {

        try {
            const response = await fetch(`.netlify/functions/get-address?query=${searchVal}`);

            const addresses = await response.json();

            setAddressSearchResults(addresses);
        } catch (err) {
            console.log(err);
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

    // make sure that the user start from the top of the page as user navigate to the page
    useEffect(() => {
        const mainElement = document.querySelector('main');
        mainElement &&
        mainElement.scrollTo(0, 0);
    }, []);

    // scroll down as the user clicks the "submit" button
    function scrollToSubmitBtn() {
        const submitButton = document.querySelector('button[type="submit"].reusable-control-btn');
        if (submitButton) {
            submitButton.scrollIntoView({behavior: 'smooth', block: 'start'});
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

    function checkAddressDetails(): boolean {
        const {city, street, houseNum, zipCode} = addressDetails;
        return city !== '' && street !== '' && houseNum !== '' && zipCode !== '';
    }

    return (
        <div className="client-details-page">

            <div className="back-to-cart-btn-container">
                <NavLink to="/cart-page" className="reusable-control-btn">
                    <MdKeyboardDoubleArrowRight/>
                    חזרה לעגלה
                </NavLink>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-container">

                    <div className="client-details">
                        <h3>פרטי הלקוח</h3>

                        <label>
                            שם:
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="שם ושם משפחה"
                                autoComplete="name"
                            />
                        </label>
                        <label>
                            אי-מייל:
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="נא להזין כתובת אי-מייל למשלוח קבלה"
                                autoComplete="email"
                            />
                        </label>
                        <label>
                            טלפון:
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                placeholder="נא להזין מספר טלפון"
                                autoComplete="tel"
                            />
                        </label>
                    </div>

                    <div className="client-address">
                        <h3>כתובת למשלוח</h3>

                        <label>
                            כתובת למשלוח:
                            <input
                                className="address-input"
                                type="text"
                                value={addressInput}
                                onChange={(e) => {
                                    setAddressInput(e.target.value);
                                    searchDebounceWrapper(e.target.value, getGoogleAutoCompleteAddressInCity);
                                }}
                                required
                                placeholder="נא להזין כתובת מגורים למשלוח"
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
                            מספר הבית:
                            <input
                                type="number"
                                value={addressDetails.houseNum}
                                onChange={(e) =>
                                    setAddressDetails(prevState => ({...prevState, houseNum: e.target.value}))}
                                required
                                placeholder="נא להזין את מספר הבית"
                            />
                        </label>
                        <label>
                            מספר הדירה:
                            <input
                                type="number"
                                value={addressDetails.apartmentNum}
                                onChange={(e) =>
                                    setAddressDetails(prevState => ({...prevState, apartmentNum: e.target.value}))}
                                placeholder="נא להזין מספר דירה (אם קיים)"
                            />
                        </label>
                        <label>
                            מיקוד:
                            <input
                                type="number"
                                value={addressDetails.zipCode}
                                onChange={(e) =>
                                    setAddressDetails(prevState => ({...prevState, zipCode: e.target.value}))}
                                required
                                placeholder="נא להזין מיקוד"
                                autoComplete="postal-code"
                            />
                        </label>
                    </div>
                </div>
                <div className="client-details-total-price">סה״כ לתשלום: {cartContext.totalPrice} ₪</div>
                <button className="reusable-control-btn" type="submit" disabled={addressSearchResults.length > 0}>
                    {
                        !loading &&
                        <>
                            למלוי פרטי אשראי ותשלום
                            <MdKeyboardDoubleArrowLeft/>
                        </>
                    }
                    {
                        loading &&
                        <ThreeDots
                            visible={true}
                            height="35"
                            width="35"
                            color="#4fa94d"
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
