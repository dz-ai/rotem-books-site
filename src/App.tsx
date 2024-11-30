import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {IBook} from "./components/book/book.tsx";
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

export const books: IBook[] = [
    {
        id: '44-699cc34ecd9fd',
        title: 'הארנבת החרוצה והצב',
        price: ECoverTypeHard.basicPrise,
        coverImage: 'rabbit.webp',
        coverType: ['hard-cover', 'soft-cover'],
        illustratorName: 'אנטוניה ויקלמן',
        description: 'קוראים יקרים,\n' +
            '\n ' +
            'שמי רותם שם טוב. גדלתי במרכז הארץ בשנות השמונים, בתקופה שבה היו סביב אזור מגוריי ' +
            'שדות רבים. שם קיבלתי את ההשראה לספר זה: ראיתי ליד ביתי הרבה ארנבים רצים וגם לא ' +
            'מעט צבים שהלכו לאיטם בחורשות. אהבתי להתבונן בבעלי החיים וניסיתי להבין מה מניע אותם.\n' +
            '\n' +
            'כאשר בגרתי נסעתי לטייל במזרח הרחוק. שם פגשתי לראשונה אנשים שמצד אחד חיים את ' +
            'הרגע ונהנים ממנו, ומצד שני - לא תמיד דואגים שיהיה להם מה לאכול ביום המחר... כאשר ' +
            'חזרתי לארץ הבנתי שכמו הארנבות והצבים גם האנשים שסביבנו מתחלקים באותו האופן: ' +
            'אלו שרצים ממקום למקום, אך אינם נהנים מתוכן הדברים עצמם, כמו הארנבת בסיפור, ואלו ' +
            'שנהנים מהתוכן, אך אינם מתכננים היטב את המחר, כמו הצב. אנשים אלה אומנם לא יישארו ' +
            'רעבים ממש, אך גם לא ישיגו הרבה דברים.\n' +
            '\n' +
            'מה אפשר לעשות? איך לאזן בין הדברים? ּפִתחו את הספר וקִראּו.\n' +
            'בסיפור הזה תכירו את הארנבת ואת הצב השונים כל כך זה מזה בהתנהגותם ובאורח חייהם. ' +
            'למרות השוני הרב הם מוצאים את הדרך לשתף פעולה זה עם זה ואף ללמוד זה מזה. כך ' +
            'ילמדו הקוראים הצעירים והקוראות הצעירות עוד משהו על החיים וגם ישתעשעו על הדרך.\n' +
            'מקווה שתיהנו,\n' +
            '\n      ' +
            'שלכם, רותם',
    },
    {
        id: 'e7c-129c43e9101c',
        title: 'עננית הרפתקנית',
        price: ECoverTypeHard.basicPrise,
        coverImage: 'cloud.webp',
        coverType: ['hard-cover', 'soft-cover'],
        illustratorName: 'אנטוניה וינקלמן',
        description: 'הרפתקאות הן כיפיות, אך צריך גם לדעת לשים גבולות. למה?\n' +
            '\n' +
            'כי הרפתקאות עלולות להיות גם מסוכנות. ' +
            'בצעירותי טיילת בארצות רבות. את הספר הזה כתבתי בהשראת ההרפתקאות שלי. כיום אחת ההרפתקאות ' +
            'המסעירות ביותר שלי היא לכתוב ספרים. הרפתקה גדולה, נכון, אך יחסית להפרתקאות העבר שלי זוהי ' +
            'הרפתקה יחסית בטוחה...\n' +
            '\n' +
            'בסיפור זה תכירו את עננית הנמרצת וההרפתקנית, המממשת את הפוטנציאל שלה כדי להגיע למקומות ' +
            'קסומים, ובדרך היא גם מביאה בשורה לחבורת העננים. היא מספרת להם סיפורים על החוויות שלה ומביאה ' +
            'להם מידע חדש על המקומות שבהם היא מבקרת ועל הדמויות שהיא פוגשת. כל אלו הגורמים לעניין רב ' +
            'אצל כל חבריה, מכיריה ומוקיריה...\n' +
            '\n' +
            'ואולי זה המסע של כל אחת ואחד מאיתנו. המסע בעקבות פיתוח התשוקות שלנו ושכלול הכישרונות שלנו ' +
            'בתוספת חוויות חיינו לצורך התפתחותנו האישית ולטובת הקהילה שבה אנחנו חיים.\n' +
            '\n' +
            'חשוב מאד לשמור על ספונטניות ועל כיף בחיים, אך עוד יותר חשוב ללמוד להיזהר, להבין שיש לנו מגבלות, ' +
            'שמותר ואף רצוי להתלהב אך צריך גם להיזהר מסכנות. חשוב שהילדים שלנו ילמדו לשמור על עצמם ' +
            'כי אין לנו חשוב יותר מהם.\n' +
            '\n' +
            'עננית הרפתקנית הוא ספרי השני. ספרי הראשון על הארנבת החרוצה והצב שימח ילדים רבים, הורים ומורים.\n' +
            '\n' +
            'קריאה מהנה,\n' +
            '\n' +
            'רותם',
    },
    {
        id: '829-2023dfd73a33',
        title: 'כשהיינו קטנים',
        price: ECoverTypeHard.basicPrise,
        coverImage: 'little.webp',
        coverType: ['hard-cover', 'soft-cover'],
        illustratorName: 'אנטוניה וינקלמן',
        description: 'האם יש דגים בתוך שלוליות ביום חורף על המדרכות?\n' +
            'האם זה יכול להיות?\n' +
            '\n' +
            'האם יורד גשם מתוך הברז הגדול שבעננים? ' +
            'לאן השמש שוקעת בסוף היום, לתוך הים? כך נראה. ' +
            'עד כאן, כבר גיליתי לכם חלק מהסודות של הספר.\n' +
            '\n' +
            '"כשהיינו קטנים" הוא ספר על קסם החיים ועל עולם הילדות.' +
            'זהו ספרי השלישי שלי, אחרי "עננית הרפתקנית" ' +
            'ו"הארנבת והצב" ספר זה נכתב מתוך זיכרונות הילדות שלי' +
            'ומתוך זיכרונות שילדים שיתפו אותי בהם. זיכרונות יפים וטובים.\n' +
            '\n' +
            'זהו ספר נהדר לילדים וגם למבוגרים. ' +
            'אתכם ההורים, הוא יחזיר עולם הילדות גם אם לזמן קצר, ' +
            'ויזכיר לכם את הסודות האבודים של גן העדן של ילדותכם. ' +
            'כאן תוכלו ליהנות מהזיכרונות החמים של ימי והתם הימים ' +
            'בהם הדברים היו כל כך פשוטים, הימים בהם הכול היה אפשרי ' +
            'והעולם היה מלא בקסם.\n' +
            'הילדים ישמחו לפגוש בסיפור את מה שהם כבר מכירים. ' +
            'הם יבינו שלדמיין זה כיף גדול...\n' +
            '\n' +
            'אני מזמינה אתכם, הורים וילדים יקרים, לקרוא את הספר ' +
            'וליהנות מהסיפור המיוחד הזה.\n' +
            '\n' +
            'שלכם, רותם',
    },
    {
        id: 'ac93b430fd6353ff',
        title: 'הנמלה הצרצר והחורף הקר',
        price: ECoverTypeSoft.basicPrise,
        coverImage: 'cricket.webp',
        coverType: ['soft-cover'],
        illustratorName: 'איילת הוך',
        description: 'האהבה שלי למשלים, ליכולת שלהם לחצות תקופות וזמנים ' +
            'ולהיות רלוונטיים, הביאה אותי לכתוב את הסיפור על ' +
            'הצרצר והנמלה, בצורה מותאמת לתקופתנו עם מסרים ' +
            'חשובים ורלוונטיים.\n' +
            '\n ' +
            'בואו להכיר את שלום הצרצר המוסיקאי ואת נימי הנמלה החרוצה. שלום הצרצר – מאושר, ' +
            'חופשי ומצחיק. מביא איתו איכויות של יצירתיות, חופש רוח ויכולת ליהנות מהרגע. לעומתו, ' +
            'נימי הנמלה, הפוגשת אותו ביער תוך כדי שהיא סוחבת גרגיר ענק, מייצגת מודעות, ומביאה ' +
            'את יכולות התכנון, ההתאמה למציאות וההתמקדות במטרות ארוכות טווח.\n' +
            '\n' +
            'לנמלה קשה ליהנות מהרגע והיא תמיד חושבת על העתיד. ושלום, שחושב רק על ההווה, ' +
            'מוצא את עצמו בחורף רעב ובלי מחסה. רק כאשר הם משלבים את כוחותיהם השונים, הם ' +
            'יכולים להתמודד ביחד עם האתגרים ולהשיג תוצאות חיוביות.\n' +
            '\n' +
            'המסר של הסיפור חשוב בעידן שבו אנו חיים, עם האתגרים התמידיים של משבר האקלים ' +
            'והצורך בשינוי תרבותי ומערכתי. הוא מדגיש את החשיבות של שיתוף פעולה ותכנון קדימה ' +
            'בהתמודדות עם אתגרים, כמו גם את היכולת להסתגל ולהתמודד עם שינויים בסביבה.',
    },
    {
        id: 'fb1-3dd3e231e830 ',
        title: 'הדייג ודג הזהב',
        price: ECoverTypeSoft.basicPrise,
        coverImage: 'fish.webp',
        coverType: ['soft-cover'],
        illustratorName: 'איילת הוך',
        description: 'במהלך עבודתי עם הילדים, סיפרתי רבות את הסיפור ' +
            '"הדייג ודג הזהב". בספר זה הוספתי פרטים והתאמתי ' +
            'אותו ל,2024- וכן סוף שונה יותר נעים ומעניין.\n' +
            '\n' +
            'הסיפור מדבר על הדייג ואשתו שיום אחד נתקלים בדג זהב המציע להם להגשים שלוש ' +
            'משאלות. הדייג ואשתו, החיים בפשטות ובמחסור, בוחרים במשאלות שישפרו את איכות ' +
            'חייהם. עם זאת, ככל שהם משיגים יותר, הם נקלעים לפיתוי לרצות עוד ועוד. בסופו של ' +
            'דבר, הם לומדים את הערך של חיים פשוטים וצנועים, ומבינים שהעושר החומרי לא ' +
            'מביא בהכרח אושר או שביעות רצון רוחנית. הסיפור מדגיש את הערכים של הכרת תודה ' +
            'וצניעות, ואת ההשלכות של חמדנות.\n' +
            '\n' +
            'הסיפור שלי מדגיש גם את החשיבות של קהילה, של פריון ושל שביעות רצון מהקיים. ' +
            'זהו מסר חשוב לילדים ולמבוגרים כאחד, במיוחד בתקופתנו אנו.',
    },
    {
        id: '5a7-4893d28dfcb3',
        title: 'העכברים ומנגינת הקסמים',
        price: ECoverTypeSoft.basicPrise,
        coverImage: 'mouse.webp',
        coverType: ['soft-cover'],
        illustratorName: 'רותם שם טוב',
        description: 'את הסיפור "החלילן מהמלין" פגשתי כשהייתי ילדה קטנה. הייתי ' +
            'מוקסמת מהסיפור אבל תמיד חשבתי לערוך אותו מחדש, לקשר אותו ' +
            'לימינו אנו ולשנות את הסיום שלו.\n' +
            '\n' +
            'תושבי העיר המלין מתמודדים עם בעיה חמורה שפוגעת באיכות חייהם. יש להם מגפה של ' +
            'עכברים ולא ניתן לפתור אותה באמצעים העומדים לרשותם. אפילו החלילן עם כוחות הקסם אינו ' +
            'יכול לסלק את הבעיה לצמיתות.\n' +
            '\n' +
            'בדומה למשבר האקלים של ,2024 שגם הוא מציב התמודדות עם כוחות טבע חזקים, הפתרון ' +
            'טמון בכך שהתושבים צריכים להבין את החשיבות של פתרונות ארוכי־טווח ושל שיתוף פעולה. ' +
            'בסופו של דבר הם מבינים שאין פתרונות קסם לאתגרים אקלימיים, ושיש להשקיע בלמידה, ' +
            'בשינוי התנהגות והרגלי חיים, ובשימור סביבתי – כחלק מהגישה הקהילתית לפתרון האתגרים ' +
            'המורכבים הללו.\n' +
            '\n' +
            'מי ייתן ונלמד מהם ולא נחזור על טעויות העבר.',
    },
];

// TODO make the pages to 100hv
// TODO create loader component
const App: React.FC = () => {

    const generalContext = useGeneralStateContext();

    useEffect(() => {
        generalContext.checkAuthentication().then();
    }, []);

    return (
        <Router>
            <div className="app">
                <Header/>
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage/>} index/>
                        <Route path="/book-details/:id" element={<BookDetailPage books={books}/>}/>
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
                        </Route>
                        <Route path="/login-page" element={<LoginPage/>}/>
                    </Routes>
                </main>
                <Footer/>
            </div>
        </Router>
    );
}

export default App;
