import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext"; // Import the Auth context
import "./styles/Register.css";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth(); // Access authentication state and logout

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setError(""); // Clear error message

        try {
            const response = await fetch("/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                alert("Registration successful!");
                navigate("/Login"); // Redirect to login page
            } else {
                const errorMessage = await response.text();
                setError(errorMessage || "Error registering.");
            }
        } catch (err) {
            console.error("Error during registration:", err);
            setError("Error registering.");
        }
    };

    if (isAuthenticated) {
        return (
            <div className="logged-in-container">
                <h3>You are already logged in</h3>
                <button type="button" onClick={logout}>
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="form-container">
            <h3>Register</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Register</button>
                <button type="button" onClick={() => navigate("/Login")}>
                    Go to Login
                </button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default Register;
