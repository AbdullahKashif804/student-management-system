const express=require("express")
const cors=require("cors")
const dotenv=require("dotenv")
const app=express()
const connectDB=require("./config/db")
const PORT=process.env.PORT || 3000

dotenv.config()
app.use(cors()) 
app.use(express.json())
connectDB()

app.get("/",(req,res)=>{
    res.send("hello")
})



app.use("/api/students",require("./routes/studentRoutes"))

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})