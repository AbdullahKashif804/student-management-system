import {useParams} from "react-router-dom";
import {useState, useEffect} from "react";
import Api from "../services/api";
import { toast } from "react-toastify";
import "../components/form.css"
import { useNavigate } from "react-router-dom";

function EditStudent() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [formData, setFormData] = useState({
            name: '',
            age: '',
            subjects: [],
            section: '',
            department: '',
            semester: '',
            gpa: '',
            cgpa: '',
            image: null
        });

    useEffect(() => {
        getStudent();
    }, []);

    const getStudent =async()=>{
        try{
            const response = await Api.get(`/students/${id}`);
            setFormData(response.data.data);

        }catch(error){
            console.error('Error fetching student:', error);
        }
    }

    const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('age', formData.age);
        payload.append('subjects', JSON.stringify(formData.subjects));
        payload.append('section', formData.section);
        payload.append('department', formData.department);
        payload.append('semester', formData.semester);
        payload.append('gpa', formData.gpa);
        payload.append('cgpa', formData.cgpa);
        if(formData.image){
            payload.append('image', formData.image);
        }
        const response = await Api.put(`/students/${id}`,payload,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                "content-type": 'multipart/form-data'
            }
        })
        console.log('Student updated successfully:', response.data);
        toast.success("Student updated successfully");
        navigate("/students");
    }catch(error){
        console.error('Error updating student:', error);
        toast.error("Error updating student");
    }
    }


    return(
        <div className="form-container">
        <div className="form-box">  
        <h1>Edit Student</h1>
        {formData.image && typeof formData.image === 'string' && (
            <img
             src={
                formData.image.startsWith("https://")
                ? formData.image
                : `http://localhost:3000${formData.image}`
            
            }
             width=" 120"
             height="120"
             alt="Student" />
            
        )}
        <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                    <label>Age:</label>
                    <input type="number" name="age" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
                </div>
                <div>
                    <label>Subjects:</label>
                    <input type="text" name="subjects" value={formData.subjects.join(', ')} onChange={(e) => setFormData({...formData, subjects: e.target.value.split(',').map(subject => subject.trim()) })} />
                </div>
                <div>
                    <label>Section:</label>
                    <input type="text" name="section" value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} />
                </div>
                <div>
                    <label>Department:</label>
                    <input type="text" name="department" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                </div>
                <div>
                    <label>Semester:</label>
                    <input type="text" name="semester" value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} />
                </div>
                <div>
                    <label>GPA:</label>
                    <input type="number" step="0.01" name="gpa" value={formData.gpa} onChange={(e) => setFormData({...formData, gpa: e.target.value})} />
                </div>
                <div>
                    <label>CGPA:</label>
                    <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={(e) => setFormData({...formData, cgpa: e.target.value})} />
                </div>
                <div>
                    <label>Image File:</label>
                    <input type="file" name="image" placeholder="Upload Image" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} />
                </div>
                <button type="submit">Edit Student</button>
            </form>
        </div>
        </div>
    )
}

export default EditStudent;