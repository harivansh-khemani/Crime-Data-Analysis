const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: './.env' });

async function testAuth() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const email = 'admin@crimedata.com';
        const password = 'password123';

        // 1. Try to find user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            console.log('User not found. Creating...');
            await User.create({
                name: 'Admin User',
                email: email,
                password: password,
                role: 'admin'
            });
            console.log('User created.');
        } else {
            console.log('User found.');
            // 2. Test password match
            const isMatch = await user.matchPassword(password);
            console.log('Password match test:', isMatch);
            
            if (!isMatch) {
                console.log('Password does not match! Updating user password...');
                user.password = password;
                await user.save();
                console.log('Password updated and hashed.');
                
                const updatedUser = await User.findOne({ email }).select('+password');
                const isMatchNow = await updatedUser.matchPassword(password);
                console.log('Password match test after update:', isMatchNow);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testAuth();
