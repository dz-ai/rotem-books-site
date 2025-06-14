import "./aboutPage.css";
import {logo} from "../../assets";
import {Helmet} from "react-helmet";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

function AboutPage() {
    const generalContext = useGeneralStateContext();
    return (
        <div className="about-me-page">
            <Helmet>
                <title>אודות רותם שמטוב – סופרת ספרי ילדים</title>
                <meta
                    name="description"
                    content="הכירו את רותם שמטוב, סופרת ספרי ילדים, יוצרת של סיפורים מרגשים בעברית. קראו על הדרך שלה, ההשראה לכתיבה, והחזון מאחורי כל ספר."
                />
                <link rel="canonical" href="https://www.rotems-books.store/about"/>
            </Helmet>
            <div className="about-me-container">
                <img
                    src={`${import.meta.env.VITE_IMAGEKIT_URL}/rotems_about_image.webp`}
                    alt={generalContext.t('aboutPage.alt')}
                />
                <p className="main-text">
                    {generalContext.t('aboutPage.mainText')}
                </p>
                <p className="end-text">{generalContext.t('aboutPage.endText1')}</p>
                <p className="end-text">{generalContext.t('aboutPage.endText2')}</p>
                <img
                    className="logo"
                    src={logo}
                    alt={generalContext.t('shared.logoAlt')}
                />
            </div>
        </div>
    );
}

export default AboutPage;
