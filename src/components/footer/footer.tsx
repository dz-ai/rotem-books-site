import React from 'react';
import './footer.css';
import {SocialMediaLinks} from "../../componentsReusable/socialMediaLinks/socialMediaLinks.tsx";
import {NavLink} from "react-router-dom";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

const Footer: React.FC = () => {
    const generalContext = useGeneralStateContext();

    return (
        <footer>
            <SocialMediaLinks iconsSize={20}/>
            <div>
                <p>{generalContext.t('footer.publisher')}</p>
            </div>
            <p>
                {generalContext.t('footer.activities')}&nbsp;&nbsp;
                <a href="tel:050-648-1668" className="tel-to-call">{generalContext.t('footer.phone')}: 050-648-1668</a>
            </p>
            <a className="more-content-link" href="https://www.rotemshemtov.com/" target="_blank">
                {generalContext.t('footer.moreContent')}: www.rotemshemtov.com
            </a>
            <NavLink to={'/policy-page'} className="site-policy-link">{generalContext.t('footer.sitePolicy')}</NavLink>
            <p>{generalContext.t('footer.allRightsReserved')}</p>
            <a className="credit-links"
               href="https://www.iconfinder.com/"
               target="_blank"
            >
                {generalContext.t('footer.creditLinks')}
            </a>
        </footer>
    );
}

export default Footer;
