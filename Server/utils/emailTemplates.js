export const ownerBookingRequestTemplate = (booking) => `
Hello Paras,

You have received a new car booking request.

📌 Booking Details:
Customer Name: ${booking.customerName}
Phone: ${booking.phone}
Car: ${booking.carName}
Pickup: ${booking.pickupDateTime}
Return: ${booking.returnDateTime}

Current Status: Pending

Please review this booking request from your dashboard.

Regards,
Paras Rentals
`;

export const customerBookingRequestTemplate = (booking) => `
Hello ${booking.customerName},

Thank you for choosing Paras Rentals 🚗

We have successfully received your booking request.
Our team will review it and update you shortly.

📌 Booking Details:
Car: ${booking.carName}
Pickup: ${booking.pickupDateTime}
Return: ${booking.returnDateTime}

Current Status: Pending

Regards,
Paras Rentals
Contact: 8085509019
`;

export const bookingConfirmedTemplate = (booking) => `
Hello ${booking.customerName},

🎉 Your booking has been CONFIRMED!

📌 Booking Details:
Car: ${booking.carName}
Pickup: ${booking.pickupDateTime}
Return: ${booking.returnDateTime}

Please be available at the pickup time.

Thank you for choosing Paras Rentals 🚗
`;

export const bookingDeclinedTemplate = (booking) => `
Hello ${booking.customerName},

Thank you for your interest in Paras Rentals.

Unfortunately, your booking request could not be accepted at this time.

📌 Booking Details:
Car: ${booking.carName}
Pickup: ${booking.pickupDateTime}
Return: ${booking.returnDateTime}

You are welcome to try a different time slot or car.

Regards,
Paras Rentals
`;

export const bookingCancelledTemplate = (booking) => `
Hello ${booking.customerName},

We would like to inform you that your booking has been CANCELLED.

📌 Booking Details:
Car: ${booking.carName}
Pickup Date & Time: ${booking.pickupDateTime}
Return Date & Time: ${booking.returnDateTime}

If you have any questions or would like to make a new booking,
please feel free to contact us.

Regards,
Paras Rentals
`;


export const bookingCompletedTemplate = (booking) => `
Hello ${booking.customerName},

✅ Your booking has been successfully COMPLETED!

We hope you had a great experience with Paras Rentals 🚗

📌 Booking Summary:
Car: ${booking.carName}
Pickup Date & Time: ${booking.pickupDateTime}
Return Date & Time: ${booking.returnDateTime}

Thank you for choosing Paras Rentals.
We look forward to serving you again!

Regards,
Paras Rentals
`;

