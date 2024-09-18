import React, {useEffect, useState} from 'react';
import './clientDetailsPage.css';
import {googleLogo} from "../../assets";
import {NavLink} from 'react-router-dom';
import {useCart} from "../../context/cartContext.tsx";
import {MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight} from "react-icons/md";

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
    remarks: string;
}

const ClientDetailsFormPage: React.FC = () => {

    const addressDetailsDefaultVal = {
        zipCode: '',
        city: '',
        houseNum: '',
        street: '',
        apartmentNum: ''
    };

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

    const cartContext = useCart();
    const cartItems = cartContext.cart;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // prepare the payment details that should be sent to create the payment form in the server
        // TOTAL PRICE
        const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

        // PRODUCTS DETAILS
        const income: TPaymentDetailsItem[] = cartItems.map(book => {
            return {description: book.title, quantity: book.quantity, price: book.price, currency: 'ILS', vatType: 0};
        });

        // TEXT TO SHOW ON THE RECEPTION
        let remarksTextContent = 'פירוט הקניה: \n';
        cartItems.forEach(book => remarksTextContent += `${book.title} ${book.quantity} יח׳ מחיר לפריט: ${book.price} ש״ח סה״כ שורה: ${book.price * book.quantity} \n`);

        // CLIENT ADDRESS AND E-MAIL - to send the reception and the products
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
            remarks: remarksTextContent,
        }

        if (name && email && addressDetails && phone && totalPrice && income.length > 0) {

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

                // navigate to the payment from url if the fetch was success and show error if somthing went wrong
                if (paymentForm.success) {
                    window.location.href = paymentForm.url;
                } else {
                    setShowMessage(paymentForm.errorMessage);
                }
            } catch (err) {
                console.log(err);
            }

        } else {
            alert('נא למלא את כל הפרטים');
        }
    }

    // Use Google Address Autocomplete API to display address suggestions for user selection
    const getGoogleAutoCompleteAddressInCity = async (searchVal: string) => {

        setAddressInput(searchVal);

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

        // peek the city and street from the results string and set them as the user address
        const arrayFromAddress = addressFromListResults.split(',');

        const street = arrayFromAddress[0]
        const city = arrayFromAddress[1]

        setAddressDetails(prevState => ({...prevState, street, city}));

        // Clear the search results and hide the suggestions list.
        setAddressSearchResults([]);
    }

    // make sure that the user start from the top of the page as user navigate to the page
    useEffect(() => {
        const mainElement = document.querySelector('main');
        mainElement &&
        mainElement.scrollTo(0, 0);
    }, []);

    return (
        <div className="client-details-page">

            <div className="back-to-cart-btn-container">
                <NavLink to="/cart-page" className="reusable-control-btn">
                    <MdKeyboardDoubleArrowRight/>
                    חזרה לעגלה
                </NavLink>
            </div>

            <h2>נא להזין את הפרטים הבאים:</h2>

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
                            />
                        </label>
                        <label>
                            טלפון:
                            <input
                                type="number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                placeholder="נא להזין מספר טלפון"
                            />
                        </label>
                    </div>

                    <div className="client-address">
                        <h3>כתובת למשלוח</h3>

                        <label>
                            כתובת מגורים:
                            <input
                                className="address-input"
                                type="text"
                                value={addressInput}
                                onChange={(e) => getGoogleAutoCompleteAddressInCity(e.target.value)}
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
                            />
                        </label>
                    </div>
                </div>
                <button className="reusable-control-btn" type="submit">
                    למלוי פרטי אשראי ותשלום
                    <MdKeyboardDoubleArrowLeft/>
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
