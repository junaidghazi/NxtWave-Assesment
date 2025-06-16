const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Multer config for image upload (store in memory as buffer)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(png|jpeg|jpg)$/)) {
      return cb(new Error('Only PNG and JPG images are allowed!'));
    }
    cb(null, true);
  },
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/practice_mern', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String },
  age: { type: Number },
  dob: { type: Date },
  image: { type: String }, // base64 string
  otp: { type: String }, // store OTP here temporarily
  otpExpiresAt: { type: Date }, // OTP expiry time
});

const User = mongoose.model('User', UserSchema);

// Helper function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit string
}

// ROUTE: Register new user
app.post('/register', upload.single('image'), async (req, res) => {
  try {
    const { name, email, password, companyName, age, dob } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Convert image buffer to base64 string
    let base64Image = null;
    if (req.file) {
      base64Image = req.file.buffer.toString('base64');
    } else {
      return res.status(400).json({ error: 'Image upload is required.' });
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      companyName,
      age,
      dob,
      image: base64Image,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ROUTE: Login - verify credentials and generate OTP
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({ error: 'Email and password are required.'});
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Sorry, we can't log you in." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Sorry, we can't log you in." });
    }

    // Generate OTP & expiry (10 minutes)
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await transporter.sendMail({
  from: '"NxtWave Security Team" <your_email@gmail.com>',
  to: user.email,
  subject: "Your One-Time Password (OTP) for NxtWave Login",
  text: `Hi ${user.name},\n\nYour NxtWave login OTP is: ${otp}. It will expire in 10 minutes.\n\nIf you did not request this OTP, please ignore this email.\n\nRegards,\nNxtWave Team`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #0056ff;">🔐 NxtWave Login Verification</h2>
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>We received a login request for your NxtWave account.</p>
      <p>Your One-Time Password (OTP) is:</p>
      <h1 style="color: #0033cc; font-size: 32px;">${otp}</h1>
      <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
      <p>If you did not request this OTP, you can safely ignore this email.</p>
      <hr style="margin: 20px 0;">
      <p style="font-size: 14px; color: #888;">Need help? Contact us at <a href="mailto:support@nxtwave.com">support@nxtwave.com</a></p>
      <p style="font-size: 13px; color: #aaa;">© ${new Date().getFullYear()} NxtWave. All rights reserved.</p>
    </div>
  `
});


    // Redirect to OTP verification page
    res.json({ message: 'OTP generated and sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ROUTE: Verify OTP
app.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if(!email || !otp){
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or OTP." });
    }
    if (!user.otp || !user.otpExpiresAt) {
      return res.status(401).json({ error: "OTP not generated or expired." });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ error: "Invalid OTP." });
    }
    if (new Date() > user.otpExpiresAt) {
      return res.status(401).json({ error: "OTP expired." });
    }

    // OTP verified: clear otp fields
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    // Return user details (except password)
    const userData = {
      name: user.name,
      email: user.email,
      companyName: user.companyName,
      age: user.age,
      dob: user.dob,
      image: user.image,
    };

    res.json({ message: 'OTP verified', user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});


// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});



// ROUTE: Delete account
app.delete('/delete-account/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const deleted = await User.findOneAndDelete({ email });
    if (!deleted) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: 'Account deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Start server
app.listen(3001, () => {
  console.log('Server listening on http://localhost:3001');
});
