import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create SMTP transporter
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com", // Brevo SMTP Host
    port: 587, // Use 465 for secure SSL connection
    secure: false, // Set to true if using port 465
    auth: {
        user: process.env.SMTP_USER, // Your Brevo SMTP email
        pass: process.env.SMTP_PASS, // Your Brevo API Key
    },
});

export default transporter;