import {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/login.css";
import { toast } from "react-toastify";
function Login() {
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
    email: '',
    password: ''
});

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
       const res = await axios.post(
  'http://localhost:3000/api/auth/login',
  loginData
);

console.log("LOGIN RESPONSE:", res.data);
toast.success("Login successful");

const token = res.data.token;

localStorage.setItem('token', token);

navigate('/students');

    } catch (error) {
        console.error('Error during login:', error);
        console.log(error.response.data);
        toast.error("Login failed")
    }
};
    return (
        <div className="login-container">
           
           <div className="login-box">
            <h1 className="login-title">Login Page</h1>
                <form onSubmit={handleSubmit} className="form-group">
                <div className="input-group">
                    <label>Email:</label>
                    <input className="login-input" type="email" name="email" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input className="login-input" type="password" name="password" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
                </div>
                <div>
                    <button className="login-btn" type="submit">Login</button>
                </div>
                </form>
            </div>
        </div>

    )
}

export default Login;