import React from "react";

// convert Timestamp to a readable Date and return it as a jsx element ready to use in the component
export const orderDate = (orderDate: number) => {
    const date = new Date(orderDate);
    const fullDate = {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDay(),
    }

    return <p className="back-office-date">{fullDate.day}/{fullDate.month}/{fullDate.year}</p>;
}
