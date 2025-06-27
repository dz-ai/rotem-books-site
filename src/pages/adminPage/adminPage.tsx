import React, {useState} from "react";
import "./admin-page.css";
import {Helmet} from "react-helmet";
import {NavLink} from "react-router-dom";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";
import {CiLogout} from "react-icons/ci";
import {ThreeDots} from "react-loader-spinner";
import {logo} from "../../assets";

const AdminPage = () => {
    const generalContext = useGeneralStateContext();

    const [loading, setLoading] = useState<boolean>(false);

    return (
        <div className="admin-page">
            <Helmet>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>

            <h2>{generalContext.t('adminPage.title')}</h2>

            <section>
                <NavLink className="reusable-control-btn" to={'/back-office-code-coupon'}>
                    {generalContext.t('adminPage.coupons')}
                </NavLink>
                <NavLink className="reusable-control-btn" to={'/back-office-page'}>
                    {generalContext.t('adminPage.orders')}
                </NavLink>
            </section>

            <button className="reusable-control-btn logout"
                    onClick={async () => {
                        setLoading(true);
                        await generalContext.logout();
                        setLoading(false);
                    }}>
                {
                    !loading ?
                        <>
                            {generalContext.language !== 'he' && <CiLogout/>}
                            {generalContext.t('adminPage.logout')}
                            {generalContext.language === 'he' && <CiLogout/>}
                        </>
                        :
                        <ThreeDots
                            visible={true}
                            height="35"
                            width="35"
                            color="#3f3fbf"
                            radius="9"
                            ariaLabel="three-dots-loading"
                        />
                }
            </button>
            <img className="logo" src={logo} alt={generalContext.t('shared.logoAlt')}/>
        </div>
    );
};

export default AdminPage;
