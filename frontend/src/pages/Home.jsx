import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../services/api";
import "../components/Home.css";
import { toast } from "react-toastify";

function Home() {
  const navigate = useNavigate();
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      const response = await Api.get("/students?page=1&limit=1");
      setTotalStudents(response.data.pagination.totalStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Error fetching student count");
    }
  };
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Student Management System</h1>
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2>Total Students</h2>
          <p>{totalStudents}</p>
        </div>
        <div className="dashboard-card">
          <h2>Add Student</h2>
          <button
            className="dashboard-btn"
            onClick={() => navigate("/add-student")}
          >
            Add Student
          </button>
        </div>
        <div className="dashboard-card">
          <h2>View Students</h2>
          <button
            className="dashboard-btn"
            onClick={() => navigate("/students")}
          >
            View Students
          </button>
        </div>
        <div className="dashboard-card">
          <h2>Search Students</h2>
          <button
            className="dashboard-btn"
            onClick={() => navigate("/students")}
          >
            Search Students
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
