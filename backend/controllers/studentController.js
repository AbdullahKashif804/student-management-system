const studentModel = require("../models/Student");

const validateStudentData = ({
  name,
  age,
  subjects,
  section,
  department,
  semester,
  gpa,
  cgpa,
  image,
}) => {
  if (!name || !String(name).trim()) {
    return "Student name is required";
  }

  const numericAge = Number(age);

  if (!age || Number.isNaN(numericAge) || numericAge <= 0) {
    return "Age must be greater than 0";
  }

  if (!Array.isArray(subjects) || subjects.length === 0) {
    return "At least one subject is required";
  }

  const validSubjects = subjects.filter(
    (subject) => String(subject).trim()
  );

  if (validSubjects.length === 0) {
    return "At least one valid subject is required";
  }

  if (!section || !String(section).trim()) {
    return "Section is required";
  }

  if (!department || !String(department).trim()) {
    return "Department is required";
  }

  if (!semester || !String(semester).trim()) {
    return "Semester is required";
  }

  const numericGpa = Number(gpa);

  if (
    gpa === "" ||
    gpa === undefined ||
    Number.isNaN(numericGpa) ||
    numericGpa < 0 ||
    numericGpa > 4
  ) {
    return "GPA must be between 0 and 4";
  }

  const numericCgpa = Number(cgpa);

  if (
    cgpa === "" ||
    cgpa === undefined ||
    Number.isNaN(numericCgpa) ||
    numericCgpa < 0 ||
    numericCgpa > 4
  ) {
    return "CGPA must be between 0 and 4";
  }

  if (!image) {
    return "Student image is required";
  }

  return null;
};

const addStudent = async (req, res) => {
  try {
    const {
      name,
      age,
      subjects,
      section,
      department,
      semester,
      gpa,
      cgpa,
    } = req.body;

    const parsedSubjects =
      typeof subjects === "string"
        ? subjects
            .split(",")
            .map((subject) => subject.trim())
            .filter(Boolean)
        : [];

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const validationError = validateStudentData({
      name,
      age,
      subjects: parsedSubjects,
      section,
      department,
      semester,
      gpa,
      cgpa,
      image,
    });

    if (validationError) {
      return res.status(400).send({
        success: false,
        message: validationError,
      });
    }

    const student = new studentModel({
      name: name.trim(),
      age: Number(age),
      subjects: parsedSubjects,
      section: section.trim(),
      department: department.trim(),
      semester: semester.trim(),
      gpa: Number(gpa),
      cgpa: Number(cgpa),
      image,
    });

    const result = await student.save();

    res.status(201).send({
      success: true,
      message: "Student added successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

const allStudent = async (req, res) => {
  try {
    const { department, sort } = req.query;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 5, 1);
    const skip = (page - 1) * limit;

    const filter = {};

    if (department) {
      filter.department = department;
    }

    let query = studentModel.find(filter);

    if (sort) {
      query = query.sort({ [sort]: 1 });
    }

    const result = await query.skip(skip).limit(limit);

    const totalStudents =
      await studentModel.countDocuments(filter);

    const totalPages = Math.ceil(totalStudents / limit);

    res.status(200).send({
      success: true,
      message: "Students fetched successfully",
      data: result,
      pagination: {
        totalPages,
        totalStudents,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

const oneStudent = async (req, res) => {
  try {
    const result = await studentModel.findById(req.params.id);

    if (!result) {
      return res.status(404).send({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "One student fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const existingStudent =
      await studentModel.findById(req.params.id);

    if (!existingStudent) {
      return res.status(404).send({
        success: false,
        message: "Student not found",
      });
    }

    let parsedSubjects = existingStudent.subjects;

    if (req.body.subjects) {
      try {
        parsedSubjects = JSON.parse(req.body.subjects);
      } catch {
        return res.status(400).send({
          success: false,
          message: "Subjects format is invalid",
        });
      }
    }

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : existingStudent.image;

    const updateData = {
      name: req.body.name ?? existingStudent.name,
      age: req.body.age ?? existingStudent.age,
      subjects: parsedSubjects,
      section: req.body.section ?? existingStudent.section,
      department:
        req.body.department ?? existingStudent.department,
      semester:
        req.body.semester ?? existingStudent.semester,
      gpa: req.body.gpa ?? existingStudent.gpa,
      cgpa: req.body.cgpa ?? existingStudent.cgpa,
      image,
    };

    const validationError =
      validateStudentData(updateData);

    if (validationError) {
      return res.status(400).send({
        success: false,
        message: validationError,
      });
    }

    updateData.name = String(updateData.name).trim();
    updateData.age = Number(updateData.age);
    updateData.subjects = updateData.subjects
      .map((subject) => String(subject).trim())
      .filter(Boolean);
    updateData.section = String(
      updateData.section
    ).trim();
    updateData.department = String(
      updateData.department
    ).trim();
    updateData.semester = String(
      updateData.semester
    ).trim();
    updateData.gpa = Number(updateData.gpa);
    updateData.cgpa = Number(updateData.cgpa);

    const result =
      await studentModel.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).send({
      success: true,
      message: "Student updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const result =
      await studentModel.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).send({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Student deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

const searchStudent = async (req, res) => {
  try {
    const { name, department, minGpa } = req.query;
    const query = {};

    if (name && name.trim()) {
      query.name = {
        $regex: name.trim(),
        $options: "i",
      };
    }

    if (department && department.trim()) {
      query.department = {
        $regex: `^${department.trim()}$`,
        $options: "i",
      };
    }

    if (minGpa !== undefined && minGpa !== "") {
      const numericMinGpa = Number(minGpa);

      if (
        Number.isNaN(numericMinGpa) ||
        numericMinGpa < 0 ||
        numericMinGpa > 4
      ) {
        return res.status(400).send({
          success: false,
          message:
            "Minimum GPA must be between 0 and 4",
        });
      }

      query.gpa = {
        $gte: numericMinGpa,
      };
    }

    const result = await studentModel.find(query);

    res.status(200).send({
      success: true,
      message: "Students searched successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

const studentStats = async (req, res) => {
  try {
    const stats = await studentModel.aggregate([
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          averageGpa: { $avg: "$gpa" },
          highestGpa: { $max: "$gpa" },
          departments: { $addToSet: "$department" },
        },
      },
      {
        $project: {
          _id: 0,
          totalStudents: 1,
          averageGpa: {
            $round: ["$averageGpa", 2],
          },
          highestGpa: 1,
          totalDepartments: {
            $size: "$departments",
          },
        },
      },
    ]);

    const result =
      stats.length > 0
        ? stats[0]
        : {
            totalStudents: 0,
            totalDepartments: 0,
            averageGpa: 0,
            highestGpa: 0,
          };

    res.status(200).send({
      success: true,
      message: "Student statistics fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addStudent,
  allStudent,
  oneStudent,
  updateStudent,
  deleteStudent,
  searchStudent,
  studentStats,
};
