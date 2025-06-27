import React, {useState} from "react";
import "./loginPage.css";
import {useLocation, useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet";
import {ThreeDots} from "react-loader-spinner";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

const LoginPage = () => {

    const generalContext = useGeneralStateContext();

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/admin-page";

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

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
                navigate(from, {replace: true});
            } else {
                setError(data.message || generalContext.t('loginPage.loginError'));
            }
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : generalContext.t('loginPage.serverError'));
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Helmet>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>

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
                    className="reusable-control-btn">
                    {
                        !loading ?
                            generalContext.t('loginPage.submitButton')
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
            </form>
        </div>
    );
};

export default LoginPage;
