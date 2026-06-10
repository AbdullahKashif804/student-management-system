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
        const student=new studentModel(req.body)
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

const allStudent=async(req,res)=>{
    try{
        const {department}=req.query
        let result;
        if(department){
            result=await studentModel.find({department})
        }else{
            result=await studentModel.find()
        }
        res.status(200).send({
            success:true,
            message:"Students fetched successfully",
            data:result
        })
    }catch(error){
        res.status(400).send({
            success:false,
            message:error.message
        })
    }
}

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
        const result=await studentModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        res.status(200).send({
            success:true,
            message:"student updated successfully",
            data:result
        })
    }catch(error){
        res.status(400).send({
            success:false,
            message:error.message
        })
    }
}

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
        const search=req.query.name;
        const result=await studentModel.find({name:{$regex:search,$options:"i"}})
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