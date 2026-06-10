const express=require("express")
const router=express.Router()
const studentController=require("../controllers/studentController")

//Student
router.post("/", studentController.addStudent)
router.get("/", studentController.allStudent)
router.get("/search", studentController.searchStudent)
router.get("/:id", studentController.oneStudent)
router.put("/:id", studentController.updateStudent)
router.delete("/:id", studentController.deleteStudent)

module.exports=router