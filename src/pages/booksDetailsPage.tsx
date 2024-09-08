import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import './bookDetailsPage.css';
import {IBook} from '../components/book';
import {MdKeyboardDoubleArrowRight} from "react-icons/md";
import {useMediaQuery} from "react-responsive";


interface IBtnSectionTemplateProps {
    book: IBook
}

const BtnSectionTemplate: React.FC<IBtnSectionTemplateProps> = ({book}) => {
    const navigate = useNavigate();
    return (
        <div className="book-details-btn-section">
            <button className="book-details-btn" onClick={() => navigate('/')}>
                <MdKeyboardDoubleArrowRight/>
                חזרה לתפריט הראשי
            </button>
            <button className="book-details-btn">הוסף לעגלה</button>
            <button className="book-details-btn">לרכישה</button>
        </div>
    );
};

interface IBookDetailPageProps {
    books: IBook[];
}

const BookDetailPage: React.FC<IBookDetailPageProps> = ({books}) => {
    const isSmallScreen = useMediaQuery({query: '(max-width: 800px)'});
    const navigate = useNavigate();

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
