const formatIST = (dateTime) => {
  return new Date(dateTime).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  })
}



export const ownerBookingRequestTemplate = (booking) => `
Hello Paras,

You have received a new car booking request.

📌 Booking Details:
Booking ID: ${booking.bookingId}
Customer Name: ${booking.customerName}
Phone: ${booking.phone}
Car: ${booking.carName}
Pickup: ${formatIST(booking.pickupDateTime)}
Return: ${formatIST(booking.returnDateTime)}

Current Status: Pending

Please review this booking request from your dashboard.

Regards,
Paras Rentals
`;

export const customerBookingRequestTemplate = (b) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>

<body style="margin:0; padding:0; background:#f2f2f2;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
    <tr>
      <td align="center">

        <!-- CARD -->
        <table width="520" cellpadding="0" cellspacing="0"
          style="
            background:#1c1c1c !important;
            border-radius:10px;
            padding:24px;
            color:#eaeaea !important;
            font-family: Arial, sans-serif;
          ">

          <!-- HEADER -->
          <tr>
            <td style="
              font-size:18px;
              font-weight:600;
              color:#ffffff !important;
              padding-bottom:16px;
            ">
              Paras Rentals
            </td>
          </tr>

          <!-- GREETING -->
          <tr>
            <td style="
              font-size:14px;
              color:#d6d6d6 !important;
              padding-bottom:18px;
              line-height:1.6;
            ">
              Hello ${b.customerName},<br/><br/>
              Thank you for choosing
              <span style="font-weight:600; color:#ffffff !important;">Paras Rentals</span>.
              We have successfully received your booking request.<br/><br/>
              Our team will review your request and update you shortly regarding the booking status.
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="border-top:1px solid #333; padding:16px 0;"></td>
          </tr>

          <!-- SECTION TITLE -->
          <tr>
            <td style="
              font-size:15px;
              font-weight:600;
              color:#ffffff !important;
              padding-bottom:12px;
            ">
              Booking Details
            </td>
          </tr>

          <!-- DETAILS TABLE -->
          <tr>
            <td>
              <table width="100%" cellpadding="6" cellspacing="0"
                style="font-size:14px; color:#eaeaea !important;">

                <tr>
                  <td width="40%" style="color:#eaeaea !important;">Booking ID</td>
                  <td width="60%" style="color:#eaeaea !important;">: ${b.bookingId}</td>
                </tr>

                <tr>
                  <td style="color:#eaeaea !important;">Car</td>
                  <td style="color:#eaeaea !important;">: ${b.carName}</td>
                </tr>

                <tr>
                  <td style="color:#eaeaea !important;">Pickup</td>
                  <td style="color:#eaeaea !important;">: ${b.pickup}</td>
                </tr>

                <tr>
                  <td style="color:#eaeaea !important;">Return</td>
                  <td style="color:#eaeaea !important;">: ${b.return}</td>
                </tr>

                <tr>
                  <td style="color:#eaeaea !important;">Status</td>
                  <td style="
                    color:#f5c542 !important;
                    font-weight:600;
                  ">
                    : ${b.status}
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="
              padding-top:22px;
              font-size:13px;
              color:#b5b5b5 !important;
              line-height:1.6;
            ">
              Regards,<br/>
              <span style="font-weight:600; color:#ffffff !important;">Paras Rentals</span><br/>
              Contact: 8085509019
            </td>
          </tr>

        </table>
        <!-- END CARD -->

      </td>
    </tr>
  </table>

</body>
</html>
`





export const bookingConfirmedTemplate = (b) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>

<body style="margin:0; padding:0; background:#f2f2f2;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
    <tr>
      <td align="center">

        <table width="520" cellpadding="0" cellspacing="0"
          style="background:#1c1c1c !important; border-radius:10px; padding:24px; color:#eaeaea !important; font-family: Arial, sans-serif;">

          <tr>
            <td style="font-size:18px; font-weight:600; color:#ffffff !important; padding-bottom:16px;">
              Paras Rentals
            </td>
          </tr>

          <tr>
            <td style="font-size:14px; color:#d6d6d6 !important; padding-bottom:18px; line-height:1.6;">
              Hello ${b.customerName},<br/><br/>
              We are pleased to inform you that your booking has been
              <span style="font-weight:600; color:#2ecc71 !important;">CONFIRMED</span>.<br/><br/>
              Please ensure you are available at the pickup time.
            </td>
          </tr>

          <tr><td style="border-top:1px solid #333; padding:16px 0;"></td></tr>

          <tr>
            <td style="font-size:15px; font-weight:600; color:#ffffff !important; padding-bottom:12px;">
              Booking Details
            </td>
          </tr>

          <tr>
            <td>
              <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;">
                <tr><td width="40%">Booking ID</td><td width="60%">: ${b.bookingId}</td></tr>
                <tr><td>Car</td><td>: ${b.carName}</td></tr>
                <tr><td>Pickup</td><td>: ${b.pickup}</td></tr>
                <tr><td>Return</td><td>: ${b.return}</td></tr>
                <tr>
                  <td>Status</td>
                  <td style="color:#2ecc71 !important; font-weight:600;">: Confirmed</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-top:22px; font-size:13px; color:#b5b5b5 !important;">
              Regards,<br/>
              <span style="font-weight:600; color:#ffffff !important;">Paras Rentals</span><br/>
              Contact: 8085509019
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`


export const bookingDeclinedTemplate = (b) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>

<body style="margin:0; padding:0; background:#f2f2f2;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
<tr><td align="center">

<table width="520" cellpadding="0" cellspacing="0"
style="background:#1c1c1c !important; border-radius:10px; padding:24px; color:#eaeaea !important; font-family: Arial, sans-serif;">

<tr><td style="font-size:18px; font-weight:600; color:#ffffff !important; padding-bottom:16px;">
Paras Rentals
</td></tr>

<tr><td style="font-size:14px; color:#d6d6d6 !important; padding-bottom:18px; line-height:1.6;">
Hello ${b.customerName},<br/><br/>
Thank you for your interest in Paras Rentals.<br/><br/>
Unfortunately, your booking request could not be accepted at this time.
</td></tr>

<tr><td style="border-top:1px solid #333; padding:16px 0;"></td></tr>

<tr><td style="font-size:15px; font-weight:600; color:#ffffff !important; padding-bottom:12px;">
Booking Details
</td></tr>

<tr><td>
<table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;">
<tr><td width="40%">Booking ID</td><td width="60%">: ${b.bookingId}</td></tr>
<tr><td>Car</td><td>: ${b.carName}</td></tr>
<tr><td>Pickup</td><td>: ${b.pickup}</td></tr>
<tr><td>Return</td><td>: ${b.return}</td></tr>
<tr><td>Status</td><td style="color:#e74c3c !important; font-weight:600;">: Declined</td></tr>
</table>
</td></tr>

<tr><td style="padding-top:22px; font-size:13px; color:#b5b5b5 !important;">
Regards,<br/>
<span style="font-weight:600; color:#ffffff !important;">Paras Rentals</span>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>
`



export const bookingCancelledTemplate = (b) => `
<!DOCTYPE html>
<html><head><meta charset="UTF-8" /></head>
<body style="margin:0; padding:0; background:#f2f2f2;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
<tr><td align="center">

<table width="520" cellpadding="0" cellspacing="0"
style="background:#1c1c1c !important; border-radius:10px; padding:24px; color:#eaeaea !important; font-family: Arial, sans-serif;">

<tr><td style="font-size:18px; font-weight:600; color:#ffffff !important; padding-bottom:16px;">
Paras Rentals
</td></tr>

<tr><td style="font-size:14px; color:#d6d6d6 !important; padding-bottom:18px; line-height:1.6;">
Hello ${b.customerName},<br/><br/>
We would like to inform you that your booking has been cancelled.
</td></tr>

<tr><td style="border-top:1px solid #333; padding:16px 0;"></td></tr>

<tr><td style="font-size:15px; font-weight:600; color:#ffffff !important; padding-bottom:12px;">
Booking Details
</td></tr>

<tr><td>
<table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;">
<tr><td width="40%">Booking ID</td><td width="60%">: ${b.bookingId}</td></tr>
<tr><td>Car</td><td>: ${b.carName}</td></tr>
<tr><td>Pickup</td><td>: ${b.pickup}</td></tr>
<tr><td>Return</td><td>: ${b.return}</td></tr>
<tr><td>Status</td><td style="color:#f39c12 !important; font-weight:600;">: Cancelled</td></tr>
</table>
</td></tr>

<tr><td style="padding-top:22px; font-size:13px; color:#b5b5b5 !important;">
Regards,<br/>
<span style="font-weight:600; color:#ffffff !important;">Paras Rentals</span>
</td></tr>

</table>
</td></tr>
</table>

</body>
</html>
`


export const bookingCompletedTemplate = (b) => `
<!DOCTYPE html>
<html><head><meta charset="UTF-8" /></head>
<body style="margin:0; padding:0; background:#f2f2f2;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
<tr><td align="center">

<table width="520" cellpadding="0" cellspacing="0"
style="background:#1c1c1c !important; border-radius:10px; padding:24px; color:#eaeaea !important; font-family: Arial, sans-serif;">

<tr><td style="font-size:18px; font-weight:600; color:#ffffff !important; padding-bottom:16px;">
Paras Rentals
</td></tr>

<tr><td style="font-size:14px; color:#d6d6d6 !important; padding-bottom:18px; line-height:1.6;">
Hello ${b.customerName},<br/><br/>
Your booking has been successfully completed.<br/><br/>
We hope you had a great experience with Paras Rentals.
</td></tr>

<tr><td style="border-top:1px solid #333; padding:16px 0;"></td></tr>

<tr><td style="font-size:15px; font-weight:600; color:#ffffff !important; padding-bottom:12px;">
Booking Summary
</td></tr>

<tr><td>
<table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;">
<tr><td width="40%">Booking ID</td><td width="60%">: ${b.bookingId}</td></tr>
<tr><td>Car</td><td>: ${b.carName}</td></tr>
<tr><td>Pickup</td><td>: ${b.pickup}</td></tr>
<tr><td>Return</td><td>: ${b.return}</td></tr>
<tr><td>Status</td><td style="color:#3498db !important; font-weight:600;">: Completed</td></tr>
</table>
</td></tr>

<tr><td style="padding-top:22px; font-size:13px; color:#b5b5b5 !important;">
Regards,<br/>
<span style="font-weight:600; color:#ffffff !important;">Paras Rentals</span>
</td></tr>

</table>
</td></tr>
</table>

</body>
</html>
`



export const registerOtpTemplate = (otp) => `
Hello,

Welcome to Paras Rentals 🚗

Your email verification OTP is:
🔐 ${otp}

This OTP is valid for 10 minutes.

If you didn’t request this, please ignore this email.

Regards,
Paras Rentals
`;

export const forgotPasswordOtpTemplate = (otp) => `
Hello,

You requested a password reset for your Paras Rentals account.

🔐 Your password reset OTP is:
${otp}

This OTP is valid for 10 minutes.

If you did not request this, please ignore this email.

Regards,
Paras Rentals
`;
