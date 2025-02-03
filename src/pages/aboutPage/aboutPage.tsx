import "./aboutPage.css";
import {logo} from "../../assets";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

function AboutPage() {
    const generalContext = useGeneralStateContext();
    return (
        <div className="about-me-page">
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
