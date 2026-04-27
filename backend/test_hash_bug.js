const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: './.env' });

async function checkHash() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'admin@crimedata.com' }).select('+password');
        if (user) {
            console.log(`Current Hash: ${user.password}`);
            
            // Trigger a dummy save to see if it hashes again
            console.log('Triggering save without modifying password...');
            user.name = user.name + ' '; // Modify something else
            await user.save();
            
            const userAfter = await User.findOne({ email: 'admin@crimedata.com' }).select('+password');
            console.log(`Hash After Save: ${userAfter.password}`);
            
            if (user.password !== userAfter.password) {
                console.log('BUG DETECTED: Hash changed even though password was not modified!');
            } else {
                console.log('No bug detected in simple save.');
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkHash();
