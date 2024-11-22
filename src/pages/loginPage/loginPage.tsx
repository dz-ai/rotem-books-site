import React, {useState} from "react";
import "./loginPage.css";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('יש להזין אימייל וסיסמא');
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
                alert('Login successful!');
                navigate('/back-office-page');
            } else {
                setError(data.message || "משהו השתבש");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "לא ניתן להתחבר לשרת");
        }
    };

    return (
        <div className="login-container">
            <h2>הרשמה</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="error">{error}</p>}
                <label>אימייל:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />
                <label>סיסמא:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />
                <button type="submit" className="reusable-control-btn">שלח</button>
            </form>
        </div>
    );
};

export default LoginPage;
