import imagekit from "../configs/imagekit.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
// import uploadToImageKit from "../utils/uploadToImageKit.js";
// import fs from "fs";




export const changeRoleToOwner = async (req, res)=>{
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role: "owner"})
        res.json({success: true, message: "Now you can list cars"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// listcars




export const addCar = async (req, res) => {
  try {
    // auth check
    const { _id } = req.user;

    // validate body
    if (!req.body?.carData) {
      return res.status(400).json({
        success: false,
        message: "carData missing from request body",
      });
    }

    // validate file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Car image is required",
      });
    }

    const car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    // ✅ USE BUFFER (serverless-safe)
    const response = await imagekit.upload({
      file: imageFile.buffer,          // <<< KEY CHANGE
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await Car.create({
      ...car,
      owner: _id,
      image: optimizedImageUrl,
    });

    res.json({ success: true, message: "Car Added" });

  } catch (error) {
    console.error("ADD CAR ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





// API to list owner cars

export const getOwnerCars = async (req, res)=>{
    try {
        const {_id} = req.user;
        const cars = await Car.find({owner: _id})
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to toggele car availability

export const toggleCarAvailaibility = async (req, res) => {
     try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        // checking if car belongs to particular user

        if(car.owner.toString() !== _id.toString()){
            return res.json({success: false, message: 'Unauthorized'})
        }

        car.isAvailable = !car.isAvailable;
        await car.save()

        res.json({success: true, message: "Availaibility Toggled"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


//to delete a car

export const deleteCar = async (req, res) => {
     try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        // checking if car belongs to particular user

        if(car.owner.toString() !== _id.toString()){
            return res.json({success: false, message: 'Unauthorized'})
        }

        car.owner = null;
        car.isAvailable = false;
        await car.save()

        res.json({success: true, message: "Car Removed"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//API to get Dashboard data


export const getDashboardData = async (req, res) => {
     try {
        const {_id, role} = req.user;
        if(role !== 'owner'){
            return res.json({success: false, message: 'Unauthorized'})
        }

        const cars = await Car.find({owner: _id})
        const bookings = await Booking.find({owner:_id}.populate).sort({createdAt: -1})

        const pendingBookings = await Booking.find({owner: _id, status:"pending"})
        const completedBookings = await Booking.find({owner: _id, status:"confirmed"})

        //monthly revenue

        const monthlyRevenue = bookings.slice().filter(booking => booking.status === 'confirmed').reduce((acc, booking)=> acc + booking.price, 0)

        const DashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0.3),
            monthlyRevenue
        }

        res.json({success: true, DashboardData})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//API to update user image

export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const imageFile = req.file;

    // ✅ use buffer directly
    const response = await imagekit.upload({
      file: imageFile.buffer,          // <<< KEY FIX
      fileName: imageFile.originalname,
      folder: "/users",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "400" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await User.findByIdAndUpdate(_id, { image: optimizedImageUrl });

    res.json({ success: true, message: "Image Updated" });

  } catch (error) {
    console.error("UPDATE USER IMAGE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//Update Car

// export const updateCar = async (req, res) => {
//   try {
//     const car = await Car.findById(req.params.id);
//     if (!car) return res.json({ success: false, message: "Car not found" });

//     // update text fields
//     Object.assign(car, req.body);

//     // replace main image if new one sent
//     if (req.files?.mainImage) {
//       car.mainImage = await uploadToImageKit(req.files.mainImage[0]);
//     }

//     // add new gallery images
//     if (req.files?.images) {
//       const newImages = await Promise.all(
//         req.files.images.map(file => uploadToImageKit(file))
//       );
//       car.images.push(...newImages);
//     }

//     await car.save();
//     res.json({ success: true, car });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
