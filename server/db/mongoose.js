const mongoose = require('mongoose');

const dbName = 'TodoApp';
const connectionString = process.env.MONGODB_URI || `mongodb://localhost:27017/${dbName}`;

mongoose.Promise = global.Promise;
mongoose.connect(connectionString);

module.exports = {mongoose};
