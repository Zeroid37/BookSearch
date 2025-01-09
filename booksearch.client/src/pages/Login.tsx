import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext"; // Import the Auth context
import "./styles/Login.css";

function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate(); // Initialize useNavigate
    const { isAuthenticated, login, logout } = useAuth(); // Access authentication state and functions

    const handleLogin = async () => {
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const result = await response.json();

                // Use the login function to store the token and authenticate
                login(result.token);

                alert(`Login successful! Welcome, ${result.userName}`);

                // Redirect to the home page or another page
                navigate("/");
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Login failed.");
            }
        } catch (err) {
            console.error("Error while logging in", err);
            alert("Something went wrong!");
        }
    };

    // Display appropriate content based on authentication status
    if (isAuthenticated) {
        return (
            <div className="logged-in-container">
                <h3>You are already logged in</h3>
                <button type="button" onClick={() => {
                    logout();
                    navigate("/login");
                }}>
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="form-container">
            <h3>Login</h3>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="button" onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
