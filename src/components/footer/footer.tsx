import React from 'react';
import './footer.css';
import {SocialMediaLinks} from "../../componentsReusable/socialMediaLinks/socialMediaLinks.tsx";

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
