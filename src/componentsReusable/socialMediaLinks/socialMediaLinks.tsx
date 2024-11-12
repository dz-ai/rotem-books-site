import "./socialMediaLinks.css";
import {facebookLogo, instagramLogo, twitterLogo, whatsAppLogo} from "../../assets";

interface ISocialMediaLogo {
    src: string;
    link: string;
    alt: string;
}

type TLogoArray = ISocialMediaLogo[];

const logoArray: TLogoArray = [
    {
        src: facebookLogo,
        link: 'https://www.facebook.com/theatrotem',
        alt: 'facebook link',
    },
    {
        src: instagramLogo,
        link: 'https://www.instagram.com/rotems_theatre/',
        alt: 'instagram link',
    },
    {
        src: twitterLogo,
        link: 'https://get-marketing.co.il/rotem-shemtov/?fbclid=IwY2xjawGXBDtleHRuA2FlbQIxMAABHaXpm52LBaxdCWHi6-ohxYT63DSvUKII3lbS77dcwMOviuNBLh5ttEhNPA_aem_6YhAXEowq_mfB_lr5KQ8MA',
        alt: 'twitter link',
    },
    {
        src: whatsAppLogo,
        link: 'https://api.whatsapp.com/send?phone=972506481668&text=%D7%94%D7%99%D7%99%20%D7%A8%D7%95%D7%AA%D7%9D,%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%A9%D7%AA%D7%97%D7%96%D7%A8%D7%99%20%D7%90%D7%9C%D7%99%D7%99%20%D7%9C%D7%A7%D7%91%D7%9C%D7%AA%20%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%A0%D7%95%D7%A1%D7%A4%D7%99%D7%9D%20%D7%95%D7%94%D7%A6%D7%A2%D7%AA%20%D7%9E%D7%97%D7%99%D7%A8',
        alt: 'whatsApp link',
    },
];

type Props = {
    iconsSize: number
}

export const SocialMediaLinks = ({iconsSize}: Props) => {
    return (
        <div className="social-media-links">
            {
                logoArray.map(logo =>
                    <a key={logo.src} href={logo.link} target="_blank">
                        <img src={logo.src} alt={logo.alt} width={iconsSize} height={iconsSize}/>
                    </a>
                )
            }
        </div>
    );
};
