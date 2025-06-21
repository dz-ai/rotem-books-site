import './notFoundPage.css';
import {Helmet} from "react-helmet";
import React from "react";

export const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            <Helmet>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>
            <p className="not-found-page-text">😲 העמוד שאתם מחפשים לא נמצא נסו כתובת אחרת 😲</p>
        </div>
    );
};
