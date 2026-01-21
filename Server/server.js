import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import multer from "multer";

//Initialize Express App

const app = express()

// Connec database
await connectDB();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.get('/', (req, res)=> res.send("Server is Running "))
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)






// app.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
//   next(err);
// });

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> console.log(`Sever running on PORT: ${PORT}`))