import './adminDropdown.css';
import React from "react";
import {NavLink} from "react-router-dom";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

interface IAdminDropdown {
    onOptionClicked: () => void;
}

const AdminDropdown: React.FC<IAdminDropdown> = ({onOptionClicked}) => {
    const generalContext = useGeneralStateContext();

    return (
        <ul onClick={() => onOptionClicked()}>
            <li>
                <NavLink to={'/back-office-page'}>Back Office</NavLink>
            </li>
            <li>
                <NavLink to={'/login-page'}>Login</NavLink>
            </li>
            <li onClick={generalContext.logout}>Logout</li>
        </ul>

    );
};

export default AdminDropdown;
