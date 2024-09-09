import React, {useEffect} from 'react';
import './bookDetailsPage.css';
import {useNavigate, useParams} from 'react-router-dom';
import {IBook} from '../../components/book/book.tsx';
import {useCart} from "../../context/cartContext.tsx";
import {MdKeyboardDoubleArrowRight} from "react-icons/md";

interface IBtnSectionTemplateProps {
    book: IBook
}

const BtnSectionTemplate: React.FC<IBtnSectionTemplateProps> = ({book}) => {
    const cartContext = useCart();
    const navigate = useNavigate();

    const addToCart = () => {
        cartContext.addToCart({id: book.id, title: book.title, price: book.price, image: book.coverImage, quantity: 1})
    }

    const buyNow = () => {
        const itemInCart = cartContext.cart.find(item => item.id === book.id);

        !itemInCart && addToCart();
        navigate('/cart-page');
    }

    return (
        <div className="book-details-btn-section">
            <button className="reusable-control-btn" onClick={() => navigate('/')}>
                <MdKeyboardDoubleArrowRight/>
                חזרה לתפריט הראשי
            </button>
            <button className="reusable-control-btn" onClick={addToCart}>הוסף לעגלה</button>
            <button className="reusable-control-btn" onClick={buyNow}>לרכישה</button>
        </div>
    );
};

interface IBookDetailPageProps {
    books: IBook[];
}

const BookDetailPage: React.FC<IBookDetailPageProps> = ({books}) => {
    const {id} = useParams<{ id: string }>();
    const book = books.find(book => id && book.id === decodeURIComponent(id));

    if (!book) {
        return <h2>Book not found</h2>;
    }

    // make sure that the user start from the top of the page as user navigate to the page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="book-details-container">

            <BtnSectionTemplate book={book}/>
            <h2>{book.title}</h2>

            <div className="bookDetail">
                <div className="book-details-columns left">
                    <img src={book.coverImage} alt={`${book.title} cover`} className="coverImage"/>
                    <p><strong> מחיר: ₪{book.price}</strong></p>
                </div>

                <div className="book-details-columns right">
                    <div className="author-illustrator-section">
                        <p>רותם שם טוב</p>
                        <p>&nbsp;/&nbsp;</p>
                        <p>איורים: {book.illustratorName}</p>
                    </div>
                    <p className='book-details-description'>{book.description}</p>
                </div>
            </div>
            <BtnSectionTemplate book={book}/>
        </div>
    );
};

export default BookDetailPage;
