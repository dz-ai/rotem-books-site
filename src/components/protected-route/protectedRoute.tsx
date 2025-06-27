import React, {useEffect, useState} from "react";
import "./protectedRoute.css";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {ThreeDots} from "react-loader-spinner";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

const PrivateRoute: React.FC = () => {

    const generalContext = useGeneralStateContext();
    const location = useLocation();

    const [firstLoad, setFirstLoad] = useState(true);

    useEffect(() => {
        generalContext.checkAuthentication()
            .then(() => setFirstLoad(false));
    }, []);

    if (firstLoad) return (
        <div className="protected-route-loader">
            <ThreeDots
                visible={true}
                height="35"
                width="35"
                color="#008000ab"
                radius="9"
                ariaLabel="three-dots-loading"
            />
        </div>
    );
    return generalContext.isLoggedIn ? <Outlet/> : <Navigate to="/login-page" state={{from: location}} replace/>;
};

export default PrivateRoute;
