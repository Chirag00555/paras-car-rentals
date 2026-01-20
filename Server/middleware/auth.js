import jwt from "jsonwebtoken"
import User from "../models/User.js";

export const protect = async (req, res, next)=>{

   

    const token = req.headers.authorization;
    if(!token){
        return res.json({success: false, message: "Not Authorised"})
    }
    try {
        const userId = jwt.decode(token, process.env.JWT_SECRET)

        if(!userId){
            return res.json({success: false, message: "Not Authorised"})
        }

        req.user = await User.findById(userId).select("-password")
        next();
    } catch (error) {
        return res.json({success: false, message: "Not Authorised"})
    }
}

// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader) {
//             return res.status(401).json({ success: false, message: "No token" });
//         }

//         const token = authHeader.startsWith("Bearer ")
//             ? authHeader.split(" ")[1]
//             : authHeader;

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         req.user = await User.findById(decoded.id).select("-password");

//         if (!req.user) {
//             return res.status(401).json({ success: false, message: "User not found" });
//         }

//         next();
//     } catch (err) {
//         return res.status(401).json({ success: false, message: "Not Authorised" });
//     }
// };
