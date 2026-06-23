import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../services/api";
import "../components/student.css";
import { toast } from "react-toastify";
function Students() {
    const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [search,setSearch]=useState({
    name:'',
    department:'',
    minGpa:'',
  });    
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    getStudents();
  }, [page, search]);

  const getStudents = async () => {
    try {
      setLoading(true);
      let response;
      if(search.name || search.department || search.minGpa){
        response = await Api.get(`/students/search?name=${search.name}&department=${search.department}&minGpa=${search.minGpa}`);
      }else{
        response = await Api.get(`/students?page=${page}&limit=6`);
      }
      setStudents(response.data.data);
      setTotalPages(response.data.pagination?.totalPages || 1);
      console.log("Pagination:", response.data.pagination);
    } catch (error) {
      console.error("Error fetching students:", error);
    }finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this student?"
  );

  if (!confirmDelete) return;
  
    try {
      await Api.delete(`/students/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      getStudents();
      toast.success("Student deleted successfully");
    } catch (error) {
      console.error("Error deleting student:", error);
        toast.error("Error deleting student");
    }
  };

  return (
    <div className="page-wrapper">
      <h1 className="student-title">Students List</h1>
      {loading && <h3>Loading students...</h3>}
      {!loading && students.length === 0 && (
  <h3>No students found</h3>
)}

      <div className="search-container">
        <input type="text" placeholder="Search by name" value={search.name} onChange={(e)=>setSearch({...search,name:e.target.value})}/>
        <input type="text" placeholder="Search by department" value={search.department} onChange={(e)=>setSearch({...search,department:e.target.value})}/>
        <input type="number" placeholder="Search by min GPA" value={search.minGpa} onChange={(e)=>setSearch({...search,minGpa:e.target.value})}/>
        <button onClick={()=>getStudents()}>Search</button>
      </div>
      {loading && <p>Loading students...</p>}
      {!loading && students.length === 0 && (
  <p>No students found 😢</p>
)}
      <div className="students-container">
        {students.map((student) => (
          <div className="students-card" key={student._id}>
            {student.image && (
              <img
                className="student-image"
                src={
                  student.image.startsWith("http")
                    ? student.image
                    : `http://localhost:3000${student.image}`
                }
                alt={student.name}
              />
            )}
            <h3>{student.name}</h3>
            <p>Age: {student.age}</p>
            <p>Subjects: {student.subjects.join(", ")}</p>
            <p>Section: {student.section}</p>
            <p>Department: {student.department}</p>
            <p>Semester: {student.semester}</p>
            <p>GPA: {student.gpa}</p>
            <p>CGPA: {student.cgpa}</p>

            <br />
            <button
              className="delete-btn"
              onClick={() => handleDelete(student._id)}
            >
              Delete
            </button>
            <br />
            <button
              className="edit-btn"
              onClick={() => navigate(`/edit-student/${student._id}`)}
            >
              Edit
            </button>
          </div>
        ))}
        <br />
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={page === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}


export default Students;
