import express from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- 1. POST /api/users/login (লগইন রুট) ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // user.matchPassword হলো User.js মডেলে ডিফাইন করা একটি মেথড
    if (user && (await user.matchPassword(password))) {
      // ✅ SUCCESS: লগইন সফল হলে টোকেনসহ ডেটা পাঠানো হচ্ছে
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id), // টোকেন জেনারেট করা হচ্ছে
      });
    } else {
      // ❌ FAIL: ইমেইল বা পাসওয়ার্ড ভুল
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error during login process' });
  }
});

// --- 2. ⛔️ POST /api/users/register (রেজিস্ট্রেশন রুট - এটিই দরকার) ---
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // isAdmin ডিফল্টভাবে false সেট হবে (User.js মডেল অনুযায়ী)
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // রেজিস্ট্রেশন সফল হলে সাথে সাথে লগইন করিয়ে দাও
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error); // <-- ডিবাগিং-এর জন্য
    res.status(500).json({ message: 'Server error during registration' });
  }
});


// --- 3. GET /api/users/profile (প্রোফাইল রুট) ---
router.get('/profile', protect, async (req, res) => {
 const user = await User.findById(req.user._id);

 if (user) {
   res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
 } else {
    res.status(404).json({ message: 'User not found' }); // 404 করা হলো
 }
});


// --- 4. GET /api/users (সব ইউজার - শুধু অ্যাডমিন) ---
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
     res.status(500).json({ message: 'Server Error fetching users' });
  }
});

export default router;