import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../services/api";
import "../components/form.css";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const AddStudent = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        subjects: "",
        section: "",
        department: "",
        semester: "",
        gpa: "",
        cgpa: "",
        image: null,
    });

    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const age = Number(formData.age);
        const gpa = Number(formData.gpa);
        const cgpa = Number(formData.cgpa);

        if (!formData.name.trim()) {
            toast.error("Student name is required");
            return false;
        }

        if (!formData.age || age <= 0) {
            toast.error("Age must be greater than 0");
            return false;
        }

        if (!formData.subjects.trim()) {
            toast.error("At least one subject is required");
            return false;
        }

        if (!formData.section.trim()) {
            toast.error("Section is required");
            return false;
        }

        if (!formData.department.trim()) {
            toast.error("Department is required");
            return false;
        }

        if (!formData.semester.trim()) {
            toast.error("Semester is required");
            return false;
        }

        if (formData.gpa === "" || gpa < 0 || gpa > 4) {
            toast.error("GPA must be between 0 and 4");
            return false;
        }

        if (formData.cgpa === "" || cgpa < 0 || cgpa > 4) {
            toast.error("CGPA must be between 0 and 4");
            return false;
        }

        if (!formData.image) {
            toast.error("Student image is required");
            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const payload = new FormData();

            payload.append("name", formData.name.trim());
            payload.append("age", formData.age);
            payload.append("subjects", formData.subjects.trim());
            payload.append("section", formData.section.trim());
            payload.append("department", formData.department.trim());
            payload.append("semester", formData.semester.trim());
            payload.append("gpa", formData.gpa);
            payload.append("cgpa", formData.cgpa);
            payload.append("image", formData.image);

            await Api.post("/students", payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Student added successfully");
            navigate("/students");
        } catch (error) {
            console.error("Error adding student:", error);

            toast.error(
                error.response?.data?.message || "Error adding student"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-box">
                <h1>Add Student</h1>
                {loading && (
                    <div className="form-loading-overlay">
                        <Loader text="Adding student..." />
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter student name"
                        />
                    </div>

                    <div>
                        <label>Age:</label>
                        <input
                            type="number"
                            name="age"
                            min="1"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Enter age"
                        />
                    </div>

                    <div>
                        <label>Subjects:</label>
                        <input
                            type="text"
                            name="subjects"
                            value={formData.subjects}
                            onChange={handleChange}
                            placeholder="Math, English, Computer"
                        />
                    </div>

                    <div>
                        <label>Section:</label>
                        <input
                            type="text"
                            name="section"
                            value={formData.section}
                            onChange={handleChange}
                            placeholder="Enter section"
                        />
                    </div>

                    <div>
                        <label>Department:</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="Enter department"
                        />
                    </div>

                    <div>
                        <label>Semester:</label>
                        <input
                            type="text"
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            placeholder="Enter semester"
                        />
                    </div>

                    <div>
                        <label>GPA:</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                            name="gpa"
                            value={formData.gpa}
                            onChange={handleChange}
                            placeholder="0.00 - 4.00"
                        />
                    </div>

                    <div>
                        <label>CGPA:</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                            name="cgpa"
                            value={formData.cgpa}
                            onChange={handleChange}
                            placeholder="0.00 - 4.00"
                        />
                    </div>

                    <div>
                        <label>Image File:</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    image: e.target.files[0],
                                })
                            }
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Adding Student..." : "Add Student"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddStudent;