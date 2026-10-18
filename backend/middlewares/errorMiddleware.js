
// Haan bhai, errorMiddleware.js bahut important hai.
//  Iska kaam hai backend mein aane wale errors ko ek central place par handle karke client ko proper response dena.

// Maan lo controller mein:
// throw new AppError("User not found", 404);

// Error directly frontend ko bhejne ke bajay:

// Controller
//    ↓
// throw AppError
//    ↓
// errorMiddleware
//    ↓
// 404
// "User not found"
//    ↓
// Frontend

// Response:

// {
//     "success": false,
//     "message": "User not found"
// }





// const errorMiddleware =(err,req,res,next)=>{

//    const statusCode = err.statusCode || 500;

//    return res.status(statusCode).json({
//     success :false,
//     message :err.message || "Internal Server Error"
//    });
// };

// export default errorMiddleware;


const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    if (statusCode === 500) console.error(err);

    const message =
        statusCode === 500 && process.env.NODE_ENV === "production"
            ? "Internal Server Error"
            : err.message || "Internal Server Error";

    return res.status(statusCode).json({ success: false, message });
};