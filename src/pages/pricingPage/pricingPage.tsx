import "./pricingPage.css";
import {logo} from "../../assets";

const PricingPage = () => {
    return (
        <div className="pricing-page">
            <table>
                <caption>מחירי כריכה קשה</caption>
                <thead>
                <tr>
                    <th>כמות</th>
                    <th>מחיר לספר (₪)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>70 ₪</td>
                </tr>
                <tr>
                    <td>2 ומעלה</td>
                    <td>60 ₪</td>
                </tr>
                </tbody>
            </table>

            <table>
                <caption>מחירי כריכה רכה</caption>
                <thead>
                <tr>
                    <th>כמות</th>
                    <th>מחיר לספר (₪)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>40 ₪</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>35 ₪</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>30 ₪</td>
                </tr>
                <tr>
                    <td>4 ומעלה</td>
                    <td>25 ₪</td>
                </tr>
                </tbody>
            </table>

            <img className="logo" src={logo} alt="לוגו קיפוד עם גיטרה"/>
        </div>
    );
};

export default PricingPage;
