import { useEffect, useState } from "react";
import Api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../components/login.css";
import { toast } from "react-toastify";

function Login() {
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const sessionExpired =
            sessionStorage.getItem("sessionExpired");

        if (sessionExpired === "true") {
            toast.error("Your session expired. Please log in again.");
            sessionStorage.removeItem("sessionExpired");
        }
    }, []);

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loginData.email.trim() || !loginData.password.trim()) {
            toast.error("Email and password are required");
            return;
        }

        try {
            setLoading(true);

            const response = await Api.post("/auth/login", loginData);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.user.role);

            // Tell Navbar that login state has changed
            window.dispatchEvent(new Event("authChange"));

            toast.success("Login successful");
            navigate("/students");
        } catch (error) {
            console.error("Error during login:", error);

            toast.error(
                error.response?.data?.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Login Page</h1>

                <form onSubmit={handleSubmit} className="form-group">
                    <div className="input-group">
                        <label>Email:</label>

                        <input
                            className="login-input"
                            type="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="input-group">
                        <label>Password:</label>

                        <input
                            className="login-input"
                            type="password"
                            name="password"
                            value={loginData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        className="login-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="account-text">
                    Don't have an account?{" "}
                    <Link to="/signup">Create Account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;