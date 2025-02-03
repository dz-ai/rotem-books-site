import "./contactPage.css";
import React, {useState} from "react";
import {SocialMediaLinks} from "../../componentsReusable/socialMediaLinks/socialMediaLinks.tsx";
import {ISendMailClientSupportPayLoad} from "../../../netlify/functions/send-email-client-support.mjs";
import {ThreeDots} from "react-loader-spinner";
import {GrSend} from "react-icons/gr";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

function ContactPage() {

    const generalContext = useGeneralStateContext();

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
                setEmailSentMessage(
                    generalContext.t('contactPage.emailSentSuccess')
                );
            } else {
                console.error(emailSendResults.message);
                setEmailSentMessage(generalContext.t('contactPage.emailSentError')
                );
            }
            setLoading(false);

        } catch (err) {
            console.error(err);
            setEmailSentMessage(
                generalContext.t('contactPage.emailSentError')
            );
            setLoading(false);
        }
    }

    return (
        <div className="contact-page">
            {
                !emailSentMessage &&
                <div className="contact-page-container">
                    <p className="contact-page-text">{generalContext.t('contactPage.contactPageText')}</p>
                    <form onSubmit={handleSubmit}>
                        <div className="contact-page-client-details">
                            <label>
                                {generalContext.t('contactPage.nameLabel')}
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder={generalContext.t('contactPage.namePlaceholder')}
                                    autoComplete="name"
                                />
                            </label>
                            <label>
                                {generalContext.t('contactPage.phoneLabel')}
                                <input
                                    className={generalContext.language === 'he' ? "he" : ""}
                                    type="tel"
                                    value={phone}
                                    required
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder={generalContext.t('contactPage.phonePlaceholder')}
                                    autoComplete="tel"
                                />
                            </label>
                            <label>
                                {generalContext.t('contactPage.emailLabel')}
                                <input
                                    type="email"
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={generalContext.t('contactPage.emailPlaceholder')}
                                    autoComplete="email"
                                />
                            </label>
                            <label>
                                {generalContext.t('contactPage.subjectLabel')}
                                <input
                                    value={subject}
                                    required
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder={generalContext.t('contactPage.subjectPlaceholder')}
                                />
                            </label>
                        </div>
                        <label className="text-area">
                            <textarea
                                required
                                placeholder={generalContext.t('contactPage.messagePlaceholder')}
                                onChange={(e) => setContent(e.target.value)}
                            ></textarea>
                        </label>
                        {
                            !loading &&
                            <button type="submit" className="reusable-control-btn">
                                {generalContext.t('contactPage.submitButton')}
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
                    <button className="reusable-control-btn" onClick={() => setEmailSentMessage(null)}>
                        {generalContext.t('contactPage.backButton')}
                    </button>
                </div>
            }
            <a href="tel:050-648-1668"
               className="tel-to-call">{generalContext.t('contactPage.phoneLink')} 050-648-1668</a>
            <SocialMediaLinks iconsSize={40}/>
        </div>
    );
}

export default ContactPage;
