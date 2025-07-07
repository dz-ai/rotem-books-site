import React, {useEffect, useRef} from 'react';
import './bookDetailsPage.css';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {coverType, IBook} from '../../components/book/book.tsx';
import {useCart} from "../../context/cartContext.tsx";
import {useInterSectionObserver} from "../../hooks/useIntersectionObserver.ts";
import {ECoverTypeHard, ECoverTypeSoft} from "../../../shared/determine-price.ts";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";
import ArrowIcon from "../../componentsReusable/arrowIcon/arrowIcon.tsx";
import {Helmet} from "react-helmet";
import {HelmetTestEnv} from "../../componentsReusable/helmetTestEnv.tsx";

interface IBtnSectionTemplateProps {
    book: IBook;
    bookCoverType: coverType;
}

const BtnSectionTemplate: React.FC<IBtnSectionTemplateProps> = ({book, bookCoverType}) => {
    const generalContext = useGeneralStateContext();
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
                <ArrowIcon arrowDirection={'R'}/>
                {generalContext.t('shared.backToPreviousPage')}
            </button>
            <button className="reusable-control-btn"
                    onClick={addToCart}>{generalContext.t('shared.add_to_cart')}</button>
            <button className="reusable-control-btn" onClick={buyNow}>{generalContext.t('shared.buyNow')}</button>
        </div>
    );
};

interface IBookDetailPageProps {
    books: IBook[];
}

const BookDetailPage: React.FC<IBookDetailPageProps> = ({books}) => {
    const isTestEnv: boolean = import.meta.env.VITE_TEST_ENV === 'true';

    const generalContext = useGeneralStateContext();

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
            {
                isTestEnv && <HelmetTestEnv/>
            }

            {
                !isTestEnv &&
                <Helmet>
                    <title>{`${book.title} ספר מאת סופרת הילדים רותם שםטוב`}</title>
                    <meta
                        name="description"
                        content={`קיראו אודות הספר ${book.title} מאת סופרת הילדים רותם שםטוב `}
                    />
                    <link rel="canonical" href={`https://www.rotems-books.store/book-details/${book.id}`}/>
                </Helmet>
            }
            <span ref={upperBtnSectionRef}>
                <BtnSectionTemplate book={book} bookCoverType={coverType}/>
            </span>
            <h2>{book.title}</h2>
            <span>{coverType === 'hard-cover' ? generalContext.t('shared.hardcover') : generalContext.t('shared.softcover')}</span>

            <div className="book-detail">
                <div className="book-details-columns left">
                    <img
                        src={`${import.meta.env.VITE_IMAGEKIT_URL}/${book.coverImage}`}
                        alt={`${book.title} cover`}
                        className="coverImage"
                    />
                    <p>
                        <strong>
                            {generalContext.t('cart.pricePerUnit')} ₪{coverType === 'hard-cover' ? ECoverTypeHard.basicPrise : ECoverTypeSoft.basicPrise}
                        </strong>
                    </p>
                </div>

                <div className="book-details-columns right">
                    <div className="author-illustrator-section">
                        <p>{generalContext.t('bookDetailsPage.name')}</p>
                        <p>&nbsp;/&nbsp;</p>
                        <p>{generalContext.t('bookDetailsPage.illustrations')}: {book.illustratorName}</p>
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
