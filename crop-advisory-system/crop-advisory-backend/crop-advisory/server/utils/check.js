const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');
const FarmProfile = require('../models/FarmProfile');

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crop_advisory');
    const farmer = await User.findOne({ email: 'farmer@demo.com' });
    if (!farmer) {
      console.log('Farmer not found');
    } else {
      console.log('Farmer found:', farmer._id);
      const profile = await FarmProfile.findOne({ userId: farmer._id });
      console.log('Profile found:', profile);
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkDB();
