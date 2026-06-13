const adminMiddleware=(req,res,next)=>{
    if(req.user.role!=="admin")
    return res.status(403).send(
        {
            success:false,
            message:"unauthorized user"
        }
    )
    next()
}

module.exports=adminMiddleware