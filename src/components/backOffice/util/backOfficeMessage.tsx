import React from "react";

interface IBackOfficeMessage {
    message: { message: string, color: string };
    setMessage: React.Dispatch<React.SetStateAction<{ message: string, color: string } | null>>;
    timeOutRef: React.MutableRefObject<null | NodeJS.Timeout>;
}


// set a message with timeout.
export const BackOfficeMessage: React.FC<IBackOfficeMessage> =
    ({message, setMessage, timeOutRef}) => {

        timeOutRef.current &&
        clearTimeout(timeOutRef.current);

        timeOutRef.current = setTimeout(() => {
            setMessage(null);
        }, 5000);

        return (
            <p className={`back-office-page-message ${message.color}`}>{message.message}</p>
        );
    }
