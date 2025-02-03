import React, {useState} from "react";
import "./loginPage.css";
import {useNavigate} from "react-router-dom";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

const LoginPage = () => {

    const generalContext = useGeneralStateContext();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError(generalContext.t('loginPage.emailPasswordRequiredError'));
            return;
        }

        try {
            const response = await fetch("/.netlify/functions/login", {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password}),
            });

            const data = await response.json();

            if (response.ok) {
                setError('');
                alert(generalContext.t('loginPage.loginSuccess'));
                navigate('/back-office-page');
            } else {
                setError(data.message || generalContext.t('loginPage.loginError'));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : generalContext.t('loginPage.serverError'));
        }
    };

    return (
        <div className="login-container">
            <h2>{generalContext.t('loginPage.title')}</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="error">{error}</p>}
                <label>{generalContext.t('loginPage.emailLabel')}</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />
                <label>{generalContext.t('loginPage.passwordLabel')}</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />
                <button
                    type="submit"
                    className="reusable-control-btn">{generalContext.t('loginPage.submitButton')}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
