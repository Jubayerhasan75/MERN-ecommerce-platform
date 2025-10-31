import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// --- ডিবাগ করার জন্য এই লগটি যোগ করা হলো ---
console.log('--- Cloudinary Config ---');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'Loaded' : 'NOT LOADED');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Loaded' : 'NOT LOADED');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Loaded' : 'NOT LOADED');
console.log('---------------------------');
// --- ডিবাগ শেষ ---

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export default cloudinary;