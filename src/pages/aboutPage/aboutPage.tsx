import "./aboutPage.css";
import {logo} from "../../assets";

function AboutPage() {
    return (
        <div className="about-me-page">
            <div className="about-me-container">
                <img
                    src={`${import.meta.env.VITE_IMAGEKIT_URL}/rotems_about_image.webp`}
                    alt="The author with her theater puppet"
                />
                <p className="main-text">
                    שלום, שמי רותם. אני מספרת סיפורים מקצועית
                    וזוהי חנות הספרים פרי עטי המבוססים בחלקם על משלי עם ובחלקם על סיפורים מקוריים שלי.
                    תמיד אהבתי לקרוא ספרים,

                    היום כולנו מוצפים בגירויים ממסכים ואני מוצאת את עולם הספרים וסיפורי הילדים כמקום אליו אני יכולה
                    ולקבל
                    השראה מדברים שקורים לנו בחיים.
                    יותר מכל,
                    האהבה שלי למשלים, ליכולת שלהם לחצות תקו וזמנים ולהיות רלוונטיים, הביאה אותי לכתוב את הספרים שמוצגים
                    לכם
                    כאן, בצורה מותאמת לתקופתנו עם מסרים חשובים שעדיין אקטואליים לזמננו.
                    מקווה שפה בספרים שמוצגים לכם כאן תוכלו גם אתם לצלול פנימה ולמלא את עולמכם בסיפורים מעולמות המשלים
                    וסיפורי הילדים.
                </p>
                <p className="end-text">מאחלת לכם קריאה מהנה,</p>
                <p className="end-text">רותם שם טוב (וגם יונתן בעלי).</p>
                <img
                    className="logo"
                    src={logo}
                    alt="לוגו קיפוד עם גיטרה"
                />
            </div>
        </div>
    );
}

export default AboutPage;
