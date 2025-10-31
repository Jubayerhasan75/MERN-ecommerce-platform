import bcrypt from 'bcryptjs';

const adminUser = [
  {
    name: 'Johan Hasan Rohan', // <-- Apnar naam
    email: 'johanhasanrohan@gmail.com', // <-- Apnar Admin Email
    // ⛔️ Password-ti ekhane hash kora ache
    password: bcrypt.hashSync('northmugda75', 10), // <-- Apnar Admin Password
    isAdmin: true,
  },
];

export default adminUser;