import "./pricingPage.css";
import {logo} from "../../assets";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

const PricingPage = () => {
    const generalContext = useGeneralStateContext();
    return (
        <div className="pricing-page">
            <table>
                <caption>{generalContext.t('pricingPage.hardcoverPrices')}</caption>
                <thead>
                <tr>
                    <th>{generalContext.t('pricingPage.quantity')}</th>
                    <th>{generalContext.t('pricingPage.price')} (₪)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>70 ₪</td>
                </tr>
                <tr>
                    <td>2 {generalContext.t('pricingPage.moreThen')}</td>
                    <td>60 ₪</td>
                </tr>
                </tbody>
            </table>

            <table>
                <caption>{generalContext.t('pricingPage.softcoverPrices')}</caption>
                <thead>
                <tr>
                    <th>{generalContext.t('pricingPage.quantity')}</th>
                    <th>{generalContext.t('pricingPage.price')} (₪)</th>
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
                    <td>4 {generalContext.t('pricingPage.moreThen')}</td>
                    <td>25 ₪</td>
                </tr>
                </tbody>
            </table>

            <img className="logo" src={logo} alt={generalContext.t('shared.logoAlt')}/>
        </div>
    );
};

export default PricingPage;
