// import jwt from "jsonwebtoken";

// const authenticate = (req, res, next) => {

//     const token = req.cookies.token;
//     console.log("Cookies:", req.cookies);
// console.log("Token:", token);

//     if (!token) {
//         return res.status(401).json({
//             message: "Unauthorized"
//         });
//     }

//     try {
//         const decoded = jwt.verify(
//             token,
//             process.env.JWT_SECRET
//         );
//         console.log("JWT VERIFIED:", decoded.id, decoded.role);

//         req.user = decoded;

//         next();

//     } catch (error) {

//          console.error("JWT VERIFY ERROR:", error.message);

//         return res.status(401).json({
//             message: "Invalid or expired token"
//         });
//     }
// };

// export default authenticate;



import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        console.error("JWT VERIFY ERROR:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

export default authenticate;