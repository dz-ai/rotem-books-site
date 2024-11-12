import "./contactPage.css";
import React, {useState} from "react";
import {SocialMediaLinks} from "../../componentsReusable/socialMediaLinks/socialMediaLinks.tsx";
import {GrSend} from "react-icons/gr";

function ContactPage() {
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');


    return (
        <div className="contact-page">
            <div className="contact-page-container">
                <p className="contact-page-text">
                    אם נתקלתם בבעיה בעת הרכישה באתר או סתם בא לכם להשאיר תגובה, מוזמנים לכתוב לי ואני אשתדל לענות בהקדם.
                    🙂
                </p>
                <form>
                    <div className="contact-page-client-details">
                        <label>
                            שם:
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="שם ושם משפחה"
                                autoComplete="name"
                            />
                        </label>
                        <label>
                            טלפון:
                            <input
                                type="tel"
                                value={phone}
                                required
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="נא להזין מספר טלפון"
                                autoComplete="tel"
                            /> </label>
                        <label>
                            אימייל:
                            <input
                                type="email"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="נא להזין כתובת אי-מייל"
                                autoComplete="email"
                            />
                        </label>
                    </div>
                    <label className="text-area">
                        <textarea onChange={(e) => console.log(e.target.value)}></textarea>
                    </label>
                    <button type="submit" className="reusable-control-btn">
                        שלח
                        <GrSend/>
                    </button>
                </form>
            </div>
            <a href="tel:050-648-166" className="tel-to-call">טלפון: 050-648-166</a>
            <SocialMediaLinks iconsSize={40}/>
        </div>
    );
}

export default ContactPage;
