const express=require("express")
const router=express.Router()
const studentController=require("../controllers/studentController")
const authMiddleware=require("../middleware/authMiddleware")
const adminMiddleware=require("../middleware/adminMiddleware")
const uploadMiddleware=require("../middleware/uploadMiddleware")

//Student
router.post("/",authMiddleware,uploadMiddleware.single("image"), studentController.addStudent)
router.get("/", studentController.allStudent)
router.get("/search", studentController.searchStudent)
router.get("/:id", studentController.oneStudent)
router.put("/:id",authMiddleware,adminMiddleware, studentController.updateStudent)
router.delete("/:id",authMiddleware,adminMiddleware, studentController.deleteStudent)
module.exports=router