const mongoose = require('mongoose');

const connectString = process.env.DB;

mongoose.connect(connectString)
    .then(() => console.log('Successfully connected to database'))
    .catch(err => console.log(`Error connected to database:`, err));

if (1 === 1) {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true })
}

module.exports = mongoose;