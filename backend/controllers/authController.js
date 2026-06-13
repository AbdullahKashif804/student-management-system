const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const signup=async(req,res)=>{
    try{
        const {name,email,password}=req.body
        if(!name || !email || !password){
            return res.status(400).send({
                success:false,
                message:"all fields are required"
            })
        }
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).send({
                success:false,
                message:"user already exists"
            })
        }
        const hashedPassword=await bcrypt.hash(password,6)
        const user=new User({
            name,
            email,
            password:hashedPassword
        })
        const result=await user.save()
        res.status(201).send({
            success:true,
            message:"user registered successfully",
            data:result
        })
    }catch(error){
        res.status(400).send({
            success:false,
            message:error.message
        })
    }
}

const login=async(req,res)=>{
    try{
    const {email,password}=req.body
    if(!email || !password){
        return res.status(400).send({
            success:false,
            message:"all fields are required"
        })
    }
    const user=await User.findOne({email})
    if(!user){
        return res.status(400).send({
            success:false,
            message:"user not found"
        })
    }
    const isMatch=await bcrypt.compare(
        password,
        user.password
    )
    if(!isMatch){
        return res.status(400).send({
            success:false,
            message:"invalid credentials"
        })
    }
    const token=jwt.sign({
        id:user._id,
        email:user.email,
        role:user.role
    },
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    )
    res.status(200).send({
        success:true,
        message:"user logged in successfully",
        token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email
        }
    })
}catch(error){
    res.status(400).send({
        success:false,
        message:error.message
    })
}
}
module.exports={
    signup,
    login
}