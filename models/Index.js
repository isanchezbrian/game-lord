const mongoose = require('mongoose');
const connectionString = 'mongodb://localhost:27017/game-lord';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.log(`MongoDB connection error: ${err}`));

// Make Models Available 
module.exports = {
    Console: require('./Console'),
    Game: require('./Game'),
}