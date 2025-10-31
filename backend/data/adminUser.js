import bcrypt from 'bcryptjs';

const adminUser = [
  {
    name: 'Johan Hasan Rohan', 
    email: 'admin@gmail.com', 
  
    password: bcrypt.hashSync('admin123', 10), 
    isAdmin: true,
  },
];

export default adminUser;