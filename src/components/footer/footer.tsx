import React from 'react';
import './footer.css';
import {SocialMediaLinks} from "../../componentsReusable/socialMediaLinks/socialMediaLinks.tsx";

const Footer: React.FC = () => {
    return (
        <footer>
            <a className="credit-links"
               href="https://www.iconfinder.com/"
               target="_blank"
            >
                "social medias icons by "Icon-Finder
            </a>
            <SocialMediaLinks iconsSize={20}/>
            <p>&copy; כל הזכויות שמורות</p>
        </footer>
    );
}

export default Footer;
