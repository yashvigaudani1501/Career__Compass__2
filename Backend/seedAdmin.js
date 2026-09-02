const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const adminExists = await User.findOne({ email: 'admin@ats.com' });
        if (adminExists) {
            console.log('Admin already exists!');
            process.exit(1);
        }

        const admin = await User.create({
            name: 'Master Admin',
            email: 'admin@ats.com',
            password: 'adminpassword123', // Will be hashed automatically
            role: 'ADMIN'
        });

        console.log('ADMIN created successfully!', admin);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();