import './notFoundPage.css';
import {Helmet} from "react-helmet";
import React from "react";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

const NotFoundPage = () => {
    const generalContext = useGeneralStateContext();
    return (
        <div className="not-found-page">
            <Helmet>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>
            <p className="not-found-page-text">
                {generalContext.t('notFoundPage.notFoundText')}
            </p>
        </div>
    );
};

export default NotFoundPage;
