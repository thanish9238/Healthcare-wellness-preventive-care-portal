import express from 'express'

const app=express();




app.use((err ,req ,res ,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || "Internal server error !";
    return res.status(500).json({
        success: false,
        statusCode,
        message,
    });
})

app.listen(3000,()=>{
    console.log("server is running at port 3000");
})