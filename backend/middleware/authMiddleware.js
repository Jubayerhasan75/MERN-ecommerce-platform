import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 'protect' middleware: চেক করে ইউজার লগইন করা কি না
const protect = async (req, res, next) => {
  let token;

  // 1. রিকোয়েস্টের হেডার থেকে 'Authorization' টোকেনটি খোঁজে
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 'Bearer' লেখাটি বাদ দিয়ে শুধু টোকেনটি নেয়
      token = req.headers.authorization.split(' ')[1];
      
      // 2. টোকেনটি ভেরিফাই করে
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 3. টোকেন থেকে পাওয়া ID দিয়ে ইউজারকে ডেটাবেস থেকে খুঁজে বের করে
      // পাসওয়ার্ড বাদে বাকি সব তথ্য req.user-এ সেভ করে
      req.user = await User.findById(decoded.id).select('-password');
      
      next(); // পরবর্তী ধাপে (মূল রুটে) যেতে দেয়
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 'admin' middleware: চেক করে ইউজারটি 'admin' কি না
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // যদি অ্যাডমিন হয়, পরবর্তী ধাপে যেতে দেয়
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export { protect, admin };