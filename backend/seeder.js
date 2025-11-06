import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Order from './models/Order.js';
import Product from './models/Product.js';
import adminUser from './data/adminUser.js';
import products from './data/products.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for Seeder!');
  } catch (err) {
    console.error(`Seeder DB Error: ${err.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
  
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

  
    await User.insertMany(adminUser);
    await Product.insertMany(products); 

    console.log('✅ Data Imported! (Admin User & Products Created)');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('✅ Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

await connectDB();

if (process.argv[2] === '-d') {
  await destroyData();
} else {
  await importData(); 
}