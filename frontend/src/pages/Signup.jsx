import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../services/api";
import "../components/login.css";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !signupData.name.trim() ||
      !signupData.email.trim() ||
      !signupData.password.trim()
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const response = await Api.post("/auth/signup", signupData);

      toast.success(
        response.data.message || "Account created successfully"
      );

      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);

      toast.error(
        error.response?.data?.message || "Account creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Create Account</h1>

        <form onSubmit={handleSubmit} className="form-group">
          <div className="input-group">
            <label>Name:</label>
            <input
              className="login-input"
              type="text"
              name="name"
              value={signupData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="input-group">
            <label>Email:</label>
            <input
              className="login-input"
              type="email"
              name="email"
              value={signupData.email}
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
              value={signupData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="account-text">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;