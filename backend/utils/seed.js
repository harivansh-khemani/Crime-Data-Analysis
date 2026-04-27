const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Crime = require('../models/Crime');
const User = require('../models/User');
const path = require('path');

dotenv.config();

const crimeTypes = ['Theft', 'Assault', 'Burglary', 'Robbery', 'Vandalism', 'Cyber Crime', 'Drug Trafficking', 'Extortion'];
const locations = ['Delhi (NCR)', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad'];
const statuses = ['Open', 'In Progress', 'Solved', 'Closed'];

const cityCoords = {
    'Delhi (NCR)': { lat: 28.6139, lng: 77.2090 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 },
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    'Pune': { lat: 18.5204, lng: 73.8567 },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714 }
};

const generateSampleData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding Indian datasets...');

    // Clear existing data
    await Crime.deleteMany();
    console.log('Cleared existing crimes.');

    const crimes = [];
    const now = new Date();

    for (let i = 0; i < 5000; i++) {
        const city = locations[Math.floor(Math.random() * locations.length)];
        const baseCoord = cityCoords[city];
        
        // Random date within last 2 years
        const date = new Date(now.getTime() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000);
        
        crimes.push({
            crimeId: `IN-CR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            type: crimeTypes[Math.floor(Math.random() * crimeTypes.length)],
            location: city,
            coordinates: {
                lat: baseCoord.lat + (Math.random() - 0.5) * 0.2,
                lng: baseCoord.lng + (Math.random() - 0.5) * 0.2
            },
            date: date,
            time: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            victimAge: Math.floor(Math.random() * 60) + 18,
            victimGender: Math.random() > 0.5 ? 'Male' : 'Female',
            weaponUsed: Math.random() > 0.7 ? 'Firearm' : (Math.random() > 0.5 ? 'Sharp Object' : 'None'),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            description: `Reported crime in ${city} district. Investigation pending.`
        });
    }

    await Crime.insertMany(crimes);
    console.log(`${crimes.length} crime records seeded successfully!`);

    // Export to CSV for Spark
    const fs = require('fs');
    const csvHeader = 'id,date,type,lat,lng,district,severity\n';
    const csvRows = crimes.map((c, i) => {
        const severityMap = { 'Theft': 2, 'Assault': 4, 'Burglary': 3, 'Robbery': 5, 'Vandalism': 2, 'Cyber Crime': 4, 'Drug Trafficking': 5, 'Extortion': 4 };
        return `${i+1},${c.date.toISOString().split('T')[0]},${c.type},${c.coordinates.lat},${c.coordinates.lng},${c.location},${severityMap[c.type] || 3}`;
    }).join('\n');
    
    const datasetsDir = path.join(__dirname, '../datasets');
    if (!fs.existsSync(datasetsDir)) fs.mkdirSync(datasetsDir);
    fs.writeFileSync(path.join(datasetsDir, 'crime_data.csv'), csvHeader + csvRows);
    console.log('Crime data exported to datasets/crime_data.csv for Spark.');

    // Create or reset default admin
    let admin = await User.findOne({ email: 'admin@crimedata.com' }).select('+password');
    if (!admin) {
        await User.create({
            name: 'Admin User',
            email: 'admin@crimedata.com',
            password: 'password123',
            role: 'admin'
        });
        console.log('Admin user created: admin@crimedata.com / password123');
    } else {
        const isMatch = await admin.matchPassword('password123');
        if (!isMatch) {
            admin.password = 'password123';
            await admin.save();
            console.log('Admin password reset to: password123');
        } else {
            console.log('Admin user verified.');
        }
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

generateSampleData();
