const express=require("express")
const cors=require("cors")
const dotenv=require("dotenv")
dotenv.config()
const app=express()
const connectDB=require("./config/db")
const PORT=process.env.PORT || 3000


app.use(cors()) 
app.use(express.json())
app.use("/uploads", express.static("uploads"))
connectDB()

app.get("/",(req,res)=>{
    res.send("hello")
})



app.use("/api/students",require("./routes/studentRoutes"))
app.use("/api/auth", require("./routes/authRoutes"))

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})