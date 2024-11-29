import React from 'react';
import './footer.css';
import {SocialMediaLinks} from "../../componentsReusable/socialMediaLinks/socialMediaLinks.tsx";
import {NavLink} from "react-router-dom";

const Footer: React.FC = () => {
    return (
        <footer>
            <SocialMediaLinks iconsSize={20}/>
            <div>
                <p>הוצאת אורן ספרים 🌲 התיאטרון של רותם</p>
            </div>
            <p>
                חוגי דרמה שעת סיפור ימי הולדת&nbsp;&nbsp;
                <a href="tel:050-648-1668" className="tel-to-call">טלפון: 050-648-1668</a>
            </p>
            <a className="more-content-link" href="https://www.rotemshemtov.com/" target="_blank">
                לתוכן נוסף: www.rotemshemtov.com
            </a>
            <NavLink to={'/policy-page'} className="site-policy-link">לתקנון האתר</NavLink>
            <p>&copy; כל הזכויות שמורות</p>
            <a className="credit-links"
               href="https://www.iconfinder.com/"
               target="_blank"
            >
                "social medias icons by "Icon-Finder
            </a>
        </footer>
    );
}

export default Footer;
