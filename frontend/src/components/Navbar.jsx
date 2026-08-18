import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const updateAuthState = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(Boolean(token));
    };

    window.addEventListener("authChange", updateAuthState);
    window.addEventListener("storage", updateAuthState);

    return () => {
      window.removeEventListener("authChange", updateAuthState);
      window.removeEventListener("storage", updateAuthState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.dispatchEvent(new Event("authChange"));

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        🎓 Student Management System
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link">
          Home
        </Link>

        {isLoggedIn && (
          <>
            <Link to="/students" className="nav-link">
              Students
            </Link>

            <Link to="/add-student" className="nav-link">
              Add
            </Link>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>

            <Link to="/signup" className="nav-link">
              Create Account
            </Link>
          </>
        )}
      </div>

      <div className="nav-right">
        {isLoggedIn && (
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;