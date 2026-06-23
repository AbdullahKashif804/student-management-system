import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Students from "./pages/Students";
import Home from "./pages/Home";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// toastify.configure();

function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/students" element={
        <ProtectedRoute>
          <Students />
        </ProtectedRoute>
      } />
      <Route path="/add-student" element={
        <ProtectedRoute>
          <AddStudent />
        </ProtectedRoute>
      } />
      <Route path="/edit-student/:id" element={
        <ProtectedRoute>
          <EditStudent />
        </ProtectedRoute>
      } />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;