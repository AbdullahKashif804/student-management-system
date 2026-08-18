import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../services/api";
import "../components/student.css";
import { toast } from "react-toastify";
import Swal from "sweetAlert2";
import Loader from "../components/Loader";

function Students() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState({
    name: "",
    department: "",
    minGpa: "",
  });

  const [isSearching, setIsSearching] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSearching) {
      getStudents();
    }
  }, [page, isSearching]);

  const getStudents = async () => {
    try {
      setLoading(true);

      const response = await Api.get(
        `/students?page=${page}&limit=6`
      );

      setStudents(response.data.data);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error(
        error.response?.data?.message ||
        "Error fetching students"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const name = search.name.trim();
    const department = search.department.trim();
    const minGpa = search.minGpa;

    if (!name && !department && !minGpa) {
      toast.error("Enter at least one search value");
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);

      const params = new URLSearchParams();

      if (name) {
        params.append("name", name);
      }

      if (department) {
        params.append("department", department);
      }

      if (minGpa) {
        params.append("minGpa", minGpa);
      }

      const response = await Api.get(
        `/students/search?${params.toString()}`
      );

      setStudents(response.data.data);
      setTotalPages(1);
    } catch (error) {
      console.error("Error searching students:", error);
      toast.error(
        error.response?.data?.message ||
        "Error searching students"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearch({
      name: "",
      department: "",
      minGpa: "",
    });

    setPage(1);
    setIsSearching(false);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete student?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await Api.delete(`/students/${id}`);

      Swal.fire({
        title: "Deleted",
        text: "Student deleted successfully.",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });

      if (isSearching) {
        handleSearch();
      } else {
        getStudents();
      }
    } catch (error) {
      console.error("Error deleting student:", error);

      Swal.fire({
        title: "Delete failed",
        text:
          error.response?.data?.message ||
          "Unable to delete this student.",
        icon: "error",
      });
    }
  };

  return (
    <div className="page-wrapper">
      <h1 className="student-title">Students List</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name"
          value={search.name}
          onChange={(e) =>
            setSearch({
              ...search,
              name: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Search by department"
          value={search.department}
          onChange={(e) =>
            setSearch({
              ...search,
              department: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Search by min GPA"
          value={search.minGpa}
          onChange={(e) =>
            setSearch({
              ...search,
              minGpa: e.target.value,
            })
          }
        />

        <button onClick={handleSearch} disabled={loading}>
          Search
        </button>

        <button
          onClick={handleClearSearch}
          disabled={loading || !isSearching}
        >
          Clear
        </button>
      </div>

      {loading && <Loader text="Loading students..." />}

      {!loading && isSearching && (
        <p>Showing search results</p>
      )}

      {!loading && students.length === 0 && (
        <h3>No students found 😢</h3>
      )}

      <div className="students-container">
        {!loading &&
          students.map((student) => (
            <div
              className="students-card"
              key={student._id}
            >
              {student.image && (
                <img
                  className="student-image"
                  src={
                    student.image.startsWith("http")
                      ? student.image
                      : `${backendUrl}${student.image}`
                  }
                  alt={student.name}
                />
              )}

              <h3>{student.name}</h3>
              <p>Age: {student.age}</p>
              <p>
                Subjects: {student.subjects.join(", ")}
              </p>
              <p>Section: {student.section}</p>
              <p>Department: {student.department}</p>
              <p>Semester: {student.semester}</p>
              <p>GPA: {student.gpa}</p>
              <p>CGPA: {student.cgpa}</p>

              {isAdmin && (
                <>
                  <br />

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(student._id)
                    }
                  >
                    Delete
                  </button>

                  <br />

                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(
                        `/edit-student/${student._id}`
                      )
                    }
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          ))}

        {!isSearching && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || loading}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={
                  page === index + 1 ? "active" : ""
                }
                disabled={loading}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setPage(page + 1)}
              disabled={
                page === totalPages || loading
              }
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Students;