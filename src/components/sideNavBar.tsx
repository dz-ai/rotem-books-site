import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './sideNavBar.css';
import {logo} from '../assets';

const SideNavBar = () => {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const toggleNav = () => {
        setIsOpen(!isOpen);
    };

    const onNavBtnClicked = (path: string): void => {
        navigate(path);
        setIsOpen(!isOpen);
    }

    return (
        <>
            <img className="logo" src={logo} alt="logo child read a book"/>
            <button className="nav-toggle" onClick={toggleNav}>
                ☰
            </button>
            <nav className={`nav ${isOpen ? 'nav-open' : ''}`}>
                <button className="nav-close" onClick={toggleNav}>
                    &times;
                </button>
                <ul>
                    <li onClick={() => onNavBtnClicked('/')}>דף הבית</li>
                    <li onClick={() => onNavBtnClicked('/about')}>אודות</li>
                    <li onClick={() => onNavBtnClicked('/contact')}>צור קשר</li>
                </ul>
            </nav>
        </>
    );
};

export default SideNavBar;
