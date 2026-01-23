import mongoose from 'mongoose'
const {ObjectId} = mongoose.Schema.Types

const bookingSchema = new mongoose.Schema({
    car: {
        type: ObjectId,
        ref: 'Car',
        required: true,
    },
    user: {
        type: String,
        ref: 'User', 
        required: true,
    },
    bookingId: {
        type: String,
        required: true,
        unique: true,
        immutable: true,
    },
    phone: {
        type: String,
        required: true
    },
    pickupDateTime: {
        type: Date,
        required: true
    },

    returnDateTime: {
        type: Date,
        required: true
    },

    pickupService: {
        type: Boolean,
        default: false
    },

    dropService: {
        type: Boolean,
        default: false
    },

    pickupLocation: {
        type: String,
    },

    dropLocation: {
        type: String,
    },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'declined', 'completed', 'cancelled'],
        default: "pending"
    },
    price: {
        type: Number,
        required: true,
    },

}, {timestamps: true})

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking;