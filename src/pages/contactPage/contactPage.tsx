import "./contactPage.css";
import React, {useState} from "react";
import {SocialMediaLinks} from "../../componentsReusable/socialMediaLinks/socialMediaLinks.tsx";
import {ISendMailClientSupportPayLoad} from "../../../netlify/functions/send-email-client-support.mjs";
import {ThreeDots} from "react-loader-spinner";
import {GrSend} from "react-icons/gr";

function ContactPage() {
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [emailSentMessage, setEmailSentMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const emailPayload: ISendMailClientSupportPayLoad = {
            subject, name, content, email, phone
        };

        try {
            setLoading(true);

            const emailSendResponse = await fetch('.netlify/functions/send-email-client-support', {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(emailPayload),
            });

            const emailSendResults = await emailSendResponse.json();

            if (emailSendResults.status === 200) {
                setEmailSentMessage('ההודעה נשלחה בהצלחה!');
            } else {
                console.error(emailSendResults.message);
                setEmailSentMessage('משהו השתבש :(');
            }
            setLoading(false);

        } catch (err) {
            console.error(err);
            setEmailSentMessage('משהו השתבש :(');
            setLoading(false);
        }
    }

    return (
        <div className="contact-page">
            {
                !emailSentMessage &&
                <div className="contact-page-container">
                    <p className="contact-page-text">
                        נתקלתם בבעיה בעת הרכישה באתר, רוצים להזמין פעילות לילדים (תאטרון בובות, חוגי דרמה, שעת סיפור,
                        ימי הולדת) או סתם בא לכם להשאיר תגובה, מוזמנים לכתוב לי ואני אשתדל לענות בהקדם.
                        🙂
                    </p>
                    <form onSubmit={handleSubmit}>
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
                            <label>
                                נושא הפניה:
                                <input
                                    value={subject}
                                    required
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="נא להזין את נושא הפניה"
                                />
                            </label>
                        </div>
                        <label className="text-area">
                            <textarea
                                required
                                placeholder="תוכן ההודעה..."
                                onChange={(e) => setContent(e.target.value)}
                            ></textarea>
                        </label>
                        {
                            !loading &&
                            <button type="submit" className="reusable-control-btn">
                                שלח
                                <GrSend/>
                            </button>
                        }
                        {
                            loading &&
                            <ThreeDots
                                visible={true}
                                height="35"
                                width="35"
                                color="#4fa94d"
                                radius="9"
                                ariaLabel="three-dots-loading"
                            />
                        }
                    </form>
                </div>
            }
            {
                emailSentMessage &&
                <div className="sent-message">
                    <p>{emailSentMessage}</p>
                    <button className="reusable-control-btn" onClick={() => setEmailSentMessage(null)}>חזרה</button>
                </div>
            }
            <a href="tel:050-648-1668" className="tel-to-call">טלפון: 050-648-1668</a>
            <SocialMediaLinks iconsSize={40}/>
        </div>
    );
}

export default ContactPage;
