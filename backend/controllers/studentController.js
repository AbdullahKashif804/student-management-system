const studentModel=require("../models/Student")

const addStudent=async(req,res)=>{
    try{
        const {name,age,subjects,section,department,semester,gpa}=req.body
        if(!name || !age || !subjects || !section || !department || !semester || !gpa){
            return res.status(400).send({
                success:false,
                message:"all fields are required"
            })
        }
        const student = new studentModel({
        ...req.body,
        subjects: req.body.subjects.split(","),
        image: req.file ? `/uploads/${req.file.filename}` : null
});
        const result=await student.save()
        res.status(201).send({
            success:true,
            message:"student added successfully",
            data:result
        })
    }catch(error){
        res.status(400).send({
            success:false,
            message:error.message
        })
    }
}

const allStudent = async (req, res) => {
    try {
        const { department, sort } = req.query;

        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 5;
        let skip = (page - 1) * limit;
        let query = studentModel.find();

        if (department) {
            query = query.find({ department });
        }
        if (sort) {
            query = query.sort({ [sort]: 1 });
        }
        query = query.skip(skip).limit(limit);
        const result = await query;
        const totalStudents = await studentModel.countDocuments(
            department?{department}:{}
        );

        const totalPages = Math.ceil(totalStudents / limit);
          
        res.status(200).send({
            success: true,
            message: "Students fetched successfully",
            data: result,
            pagination: {
                totalPages,
                totalStudents,
                currentpage: page,
                pagesize: limit
            },
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        });
    }
};

const oneStudent=async(req,res)=>{
    try{
        const result=await studentModel.findById(req.params.id)
        res.status(200).send({
            success:true,
            message:"One Student fetched successfully",
            data:result
        })
    }catch(error){
        res.status(400).send({
            success:false,
            message:error.message
        })
    }
}

const updateStudent=async(req,res)=>{
    try{
        const {subjects}=req.body
          let updateData = {
            ...req.body
        };

        if (subjects) {
            updateData.subjects = JSON.parse(subjects);
        }

       
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const result = await studentModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: "student updated successfully",
            data: result
        });

    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        });
    }
};
    
const deleteStudent=async(req,res)=>{
    try{
        const result=await studentModel.findByIdAndDelete(req.params.id)
        res.status(200).send({
            success:true,
            message:"student deleted successfully",
            data:result
        })
    }catch(error){
        res.status(400).send({
            success:false,
            message:error.message
        })
    }
}

const searchStudent=async(req,res)=>{
    try{
        const {name,department,minGpa}=req.query
        let query={}
        if(name){
            query.name={$regex:name,$options:"i"}
        }
        if(department){
            query.department=department
        }
        if(minGpa){
            query.gpa={$gte:Number(minGpa)}
        }
        const result=await studentModel.find(query)
        res.status(200).send({
            success:true,
            message:"Student searched successfully",
            data:result
        
    })
    }catch(error){
        res.status(400).send({
            success:false,
            message:error.message
        })
    }
}

module.exports={
    addStudent,
    allStudent,
    oneStudent,
    updateStudent,
    deleteStudent,
    searchStudent
}