const mongoose=require("mongoose")

const StudentData=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    subjects:{
        type:[String],
        required:true
    },
    section:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    semester:{
        type:String,
        required:true
    },
    gpa:{
        type:Number,
        required:true    
    },
    cgpa:{
        type:Number,
        required:true
    }
})

module.exports=mongoose.model("Student",StudentData)