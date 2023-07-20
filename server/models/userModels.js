const mongoose = require('mongoose');
const { mongoDB } = require('./secrets.js');

// Used MongoDB
const MONGO_URI = `mongodb+srv://${mongoDB.username}:${mongoDB.password}@eventtrackerdb.5waxbzz.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(MONGO_URI, {
    // options for the connect method to parse the URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // sets the name of the DB that our collections are part of
    dbName: 'EventTrackerDB',
  })
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;

// sets a schema for the 'users' collection
const userSchema = new Schema({
  email: String,
  username: String,
  location: {
    city: String,
    state: String,
  },
  artists: [String],
  genres: [String],
  accessToken: String,
});

// creats a model for the 'user' collection that will be part of the export
const Users = mongoose.model('user', userSchema);

const currentUserSchema = new Schema({
  email: String,
  accessToken: String,
  username: String,
});

// exports all the models in an object to be used in the controller
module.exports = { Users };
