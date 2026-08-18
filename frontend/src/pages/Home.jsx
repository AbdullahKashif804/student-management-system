import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../services/api";
import "../components/Home.css";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function Home() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDepartments: 0,
    averageGpa: 0,
    highestGpa: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentStats();
  }, []);

  const getStudentStats = async () => {
    try {
      setLoading(true);

      const response = await Api.get("/students/stats");

console.log("FULL API RESPONSE:", response);
console.log("RESPONSE DATA:", response.data);
console.log("STATS DATA:", response.data?.data);

setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching student statistics:", error);

      toast.error(
        error.response?.data?.message ||
        "Error fetching dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">
        Welcome to the Student Management System
      </h1>

      {loading ? (
        <Loader text="Loading dashboard..." />
      ) : (
        <div className="dashboard-container">
          <div className="dashboard-card">
            <h2>Total Students</h2>
            <h1>{stats.totalStudents}</h1>
          </div>

          <div className="dashboard-card">
            <h2>Total Departments</h2>
            <h1>{stats.totalDepartments}</h1>
          </div>

          <div className="dashboard-card">
            <h2>Average GPA</h2>
            <h1>{Number(stats.averageGpa).toFixed(2)}</h1>
          </div>

          <div className="dashboard-card">
            <h2>Highest GPA</h2>
            <h1>{Number(stats.highestGpa).toFixed(2)}</h1>
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
      )}
    </div>
  );
}

export default Home;