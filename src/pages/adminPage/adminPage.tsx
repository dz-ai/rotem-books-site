import React, {useState} from "react";
import "./admin-page.css";
import {Helmet} from "react-helmet";
import {NavLink} from "react-router-dom";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";
import {CiLogout} from "react-icons/ci";
import {ThreeDots} from "react-loader-spinner";

const AdminPage = () => {
    const generalContext = useGeneralStateContext();

    const [loading, setLoading] = useState<boolean>(false);

    return (
        <div className="admin-page">
            <Helmet>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>

            <h2>תפריט אדמין</h2>

            <section>
                <NavLink className="reusable-control-btn" to={'/back-office-code-coupon'}>
                    קופונים
                </NavLink>
                <NavLink className="reusable-control-btn" to={'/back-office-page'}>
                    מעקב הזמנות
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
                            <CiLogout/>
                            התנתק
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
            <img className="logo" src="/src/assets/rotem-logo.png" alt="Igel-Logo mit Gitarre"/></div>
    );
};

export default AdminPage;
