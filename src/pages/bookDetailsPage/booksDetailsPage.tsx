import React, {useEffect, useRef} from 'react';
import './bookDetailsPage.css';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {coverType, IBook} from '../../components/book/book.tsx';
import {useCart} from "../../context/cartContext.tsx";
import {useInterSectionObserver} from "../../hooks/useIntersectionObserver.ts";
import {MdKeyboardDoubleArrowRight} from "react-icons/md";
import {ECoverTypeHard, ECoverTypeSoft} from "../../App.tsx";

interface IBtnSectionTemplateProps {
    book: IBook;
    bookCoverType: coverType;
}

const BtnSectionTemplate: React.FC<IBtnSectionTemplateProps> = ({book, bookCoverType}) => {
    const cartContext = useCart();
    const navigate = useNavigate();

    const addToCart = () => {
        cartContext.addToCart({
            id: book.id,
            title: book.title,
            price: book.price,
            coverType: bookCoverType,
            image: book.coverImage,
            quantity: 1
        });
    }

    const buyNow = () => {
        const itemInCart = cartContext.cart.find(item => item.id === book.id);

        !itemInCart && addToCart();
        navigate('/cart-page');
    }

    return (
        <div className="book-details-btn-section">
            <button className="reusable-control-btn" onClick={() => window.history.back()}>
                <MdKeyboardDoubleArrowRight/>
                חזרה לדף הקודם
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

    const [searchParams, setSearchParams] = useSearchParams();
    const coverType = searchParams.get('cover-type') as coverType;

    const upperBtnSectionRef = useRef<null>(null);
    const isElementOnTheScreen = useInterSectionObserver(upperBtnSectionRef);

    const {id} = useParams<{ id: string }>();
    const book = books.find(book => id && book.id === decodeURIComponent(id));

    if (!book) {
        return <h2>Book not found</h2>;
    }

    // make sure that the user start from the top of the page as user navigate to the page
    useEffect(() => {
        const mainElement = document.querySelector('main');
        mainElement &&
        mainElement.scrollTo(0, 0);
    }, []);

    return (
        <div className="book-details-container">

            <span ref={upperBtnSectionRef}>
                <BtnSectionTemplate book={book} bookCoverType={coverType}/>
            </span>
            <h2>{book.title}</h2>
            <span>{coverType === 'hard-cover' ? 'כריכה קשה' : 'כריכה רכה'}</span>

            <div className="bookDetail">
                <div className="book-details-columns left">
                    <img
                        src={`${import.meta.env.VITE_IMAGEKIT_URL}/${book.coverImage}`}
                        alt={`${book.title} cover`}
                        className="coverImage"
                    />
                    <p>
                        <strong>
                            מחיר: ₪{coverType === 'hard-cover' ? ECoverTypeHard.basicPrise : ECoverTypeSoft.basicPrise}
                        </strong>
                    </p>
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
            {
                !isElementOnTheScreen &&
                <BtnSectionTemplate book={book} bookCoverType={coverType}/>
            }
        </div>
    );
};

export default BookDetailPage;
