import axios from 'axios';
import React, { useState } from 'react';
import '../components/form.css';
import { toast } from "react-toastify";
const AddStudent = () => {
    
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        subjects: '',
        section: '',
        department: '',
        semester: '',
        gpa: '',
        cgpa: '',
        image: null
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('age', formData.age);
            payload.append('subjects', formData.subjects);
            payload.append('section', formData.section);
            payload.append('department', formData.department);
            payload.append('semester', formData.semester);
            payload.append('gpa', formData.gpa);
            payload.append('cgpa', formData.cgpa);
            payload.append('image', formData.image);

            const token = localStorage.getItem('token');
            const response =await axios.post('http://localhost:3000/api/students',
                 payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                     Authorization: `Bearer ${token}`
                }
            });
                console.log('Student added successfully:', response.data);
                toast.success("Student added successfully");
                setFormData({
                    name: '',
                    age: '',
                    subjects: '',
                    section: '',
                    department: '',
                    semester: '',
                    gpa: '',
                    cgpa: '',
                    image: null
                });
        } catch (error) {
            console.error('Error adding student:', error);
            toast.error("Error adding student");
        }
    };

    return (
        <div className="form-container">
          <div className="form-box">
            <h1>Add Student</h1>
            {/* Add student form goes here */}
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
                    <input type="text" name="subjects" value={formData.subjects} onChange={(e) => setFormData({...formData, subjects: e.target.value.split(',').map(subject => subject.trim()) })} />
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
                <button type="submit">Add Student</button>
            </form>
            </div>
        </div>
    );

}
export default AddStudent;