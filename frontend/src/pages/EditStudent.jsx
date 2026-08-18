import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../services/api";
import { toast } from "react-toastify";
import "../components/form.css";
import Loader from "../components/Loader";

function EditStudent() {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        subjects: [],
        section: "",
        department: "",
        semester: "",
        gpa: "",
        cgpa: "",
        image: null,
    });

    const [fetching, setFetching] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getStudent();
    }, [id]);

    const getStudent = async () => {
        try {
            setFetching(true);

            const response = await Api.get(`/students/${id}`);
            setFormData(response.data.data);
        } catch (error) {
            console.error("Error fetching student:", error);

            toast.error(
                error.response?.data?.message ||
                "Error fetching student"
            );
        } finally {
            setFetching(false);
        }
    };

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

        if (
            !Array.isArray(formData.subjects) ||
            formData.subjects.length === 0 ||
            formData.subjects.every((subject) => !subject.trim())
        ) {
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

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);

            const cleanedSubjects = formData.subjects
                .map((subject) => subject.trim())
                .filter(Boolean);

            const payload = new FormData();

            payload.append("name", formData.name.trim());
            payload.append("age", formData.age);
            payload.append("subjects", JSON.stringify(cleanedSubjects));
            payload.append("section", formData.section.trim());
            payload.append("department", formData.department.trim());
            payload.append("semester", formData.semester.trim());
            payload.append("gpa", formData.gpa);
            payload.append("cgpa", formData.cgpa);

            if (formData.image instanceof File) {
                payload.append("image", formData.image);
            }

            await Api.put(`/students/${id}`, payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Student updated successfully");
            navigate("/students");
        } catch (error) {
            console.error("Error updating student:", error);

            toast.error(
                error.response?.data?.message ||
                "Error updating student"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-box">
                <h1>Edit Student</h1>

                {fetching ? (
                    <Loader text="Loading student..." />
                ) : (
                    <>
                        {submitting && (
                            <div className="form-loading-overlay">
                                <Loader text="Updating student..." />
                            </div>
                        )}

                        {formData.image &&
                            typeof formData.image === "string" && (
                                <img
                                    src={
                                        formData.image.startsWith("http")
                                            ? formData.image
                                            : `${backendUrl}${formData.image}`
                                    }
                                    width="120"
                                    height="120"
                                    alt="Student"
                                />
                            )}

                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label>Age:</label>
                                <input
                                    type="number"
                                    name="age"
                                    min="1"
                                    value={formData.age}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            age: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label>Subjects:</label>
                                <input
                                    type="text"
                                    name="subjects"
                                    value={formData.subjects.join(", ")}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            subjects: e.target.value
                                                .split(",")
                                                .map((subject) => subject.trim()),
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label>Section:</label>
                                <input
                                    type="text"
                                    name="section"
                                    value={formData.section}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            section: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label>Department:</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            department: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label>Semester:</label>
                                <input
                                    type="text"
                                    name="semester"
                                    value={formData.semester}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            semester: e.target.value,
                                        })
                                    }
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
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            gpa: e.target.value,
                                        })
                                    }
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
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            cgpa: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label>New Image File:</label>
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

                            <button type="submit" disabled={submitting}>
                                {loading ? "Updating Student..." : "Edit Student"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default EditStudent;