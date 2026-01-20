import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Paras Rentals" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    text: message,
  });
};

export default sendEmail;
