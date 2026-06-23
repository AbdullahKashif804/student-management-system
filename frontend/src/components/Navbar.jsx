import "./Navbar.css";
import { Link,useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const Navbar=()=>{

    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser(true);
        }
    }, []);
    const handlelogout=(e)=>{
        localStorage.removeItem('token');
        navigate("/login");
    }

    return(
        <nav className="navbar">
            <div className="logo">
               🎓 Student Management System
            </div>
            <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/students" className="nav-link">Students</Link>
            <Link to="/add-student" className="nav-link">Add</Link>
            <Link to="/login" className="nav-link">Login</Link>
            </div>

            <div className="nav-right">
                {user && (
                <button className="logout-btn" onClick={handlelogout}>
                    Logout
                </button>
            )}
            </div>
            
        </nav>
    )
    
}

export default Navbar;