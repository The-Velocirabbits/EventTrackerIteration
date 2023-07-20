const { resolvePath } = require('react-router');
const { Users, CurrentUsers } = require('../models/userModels.js');

const userController = {};

//fetching user document from 'Users' collection in database
userController.getUserInfo = async (req, res, next) => {
  console.log('inside userController.getUserInfo')
  const email = req.query.email;
  console.log(email);
  if (!email)
    return next({
      log: `userController.getUserInfo ERROR: email missing from req body`,
      message: {
        err: 'userController.getUserInfo: ERROR: email missing from req body',
      },
    });
  try {
    const userInfo = await Users.findOne({ email });
    res.locals.userInfo = userInfo;
    console.log(userInfo);
    /* Expect userInfo to come back as:
    { 
    email: String,
    location: {
        city: String,
        state: String,
        }
    artists: [Artist1, Artist2, Artist3]
    genres: [Genre1, Genre2, Genre3]
    }
    */
    console.log('leaving userController.getUserInfo')

    return next();
  } catch {
    return next({
      log: `userController.getUserInfo ERROR: trouble getting user data from database`,
      message: {
        err: 'userController.getUserInfo: ERROR: trouble getting user data from database',
      },
    });
  }
};

userController.createUser = async (req, res, next) => {
  console.log('inside  userController.createUser')
  const { email, city, state, accessToken, username } = req.body;
  if (!email || !city || !state || !username || !accessToken)
    return next({
      log: `userController.createUser ERROR: missing email or location on req body`,
      message: {
        err: 'userController.createUser: ERROR: missing email or location on req body',
      },
    });
  try {
    const newUser = await Users.create({
      email,
      accessToken,
      username,
      location: { city, state },
    });
    res.locals.newUser = newUser;
    console.log('leaving userController.createUser')
    return next();
  } catch (err) {
    return next({
      log: `userController.createUser ERROR: trouble creating new user`,
      message: {
        err: `userController.createUser ERROR: ${err}`,
      },
    });

  }
};

userController.updateUser = async (req, res, next) => {
  console.log('inside userController.updateUser');

  const email = req.query.email;
  const { artists, genres, location, type } = req.body;
  console.log(artists);
  console.log(genres);

  if (!type || (!artists && !genres && !location)) {
    return next({
      log: 'userController.updateUser ERROR: missing artist/genre/location/type on req body',
      message: {
        err: 'userController.updateUser: ERROR: missing artist/genre/location/type on req body',
      },
    });
  }

  try {
    if (location) {
      const updatedUser = await Users.findOneAndUpdate(
        { email: email },
        { $set: { location: location } },
        { new: true }
      );
    }
    if (artists && type === 'add') {
      const updatedUser = await Users.findOneAndUpdate(
        { email: email },
        { $push: { artists: artists } },
        { new: true }
      );
    } else if (artists && type === 'delete') {
      const updatedUser = await Users.findOneAndUpdate(
        { email: email },
        { $pull: { artists: artists } },
        { new: true }
      );
    }
    if (genres && type === 'add') {
      const updatedUser = await Users.findOneAndUpdate(
        { email: email },
        { $push: { genres: genres } },
        { new: true }
      );
    } else if (genres && type === 'delete') {
      const updatedUser = await Users.findOneAndUpdate(
        { email: email },
        { $pull: { genres: genres } },
        { new: true }
      );
    }
    res.locals.updatedUser = updatedUser;
    console.log(res.locals.updatedUser);
    console.log('leaving userController.updateUser');
    return next();
  } catch (err) {
    return next({
      log: 'userController.updateUser ERROR: trouble updating user',
      message: {
        err: `userController.updateUser ERROR: ${err}`,
      },
    });
  }
};


//initially updates users prefered artists
userController.updateUserSpotify = async (req, res, next) => {
  console.log('inside  userController.updateUserSpotify')
  const email = res.locals.email;
  const artists = res.locals.spotifyArtists;
  if (!artists || !email)
    return next({
      log: `userController.updateUserSpotify ERROR: missing artist or email`,
      message: {
        err: 'userController.updateUserSpotify: ERROR: missing artist or email',
      },
    });

  try {
    const updatedUser = await Users.findOneAndUpdate(
      { email },
      { artists },
      { new: true }
    );
    res.locals.updatedUserSpotify = updatedUserSpotify;
    console.log('leaving userController.updateUserSpotify')
    return next();
  } catch (err) {
    return next({
      log: `userController.createUserSpotify ERROR: trouble updating user with Spotify info`,
      message: {
        err: `userController.createUserSpotify ERROR: ${err}`,
      },
    });
  }
};

//add middleware to send access token to database
userController.addToken = async (req, res, next) => {
  console.log('entering addToken');
  console.log('LOOK HERE: ', res.locals)
  const accessToken = req.body.accessToken;
  const email = res.locals.email;
  const username = res.locals.username;
  let exists = false;
  try {
    const userDoc = await Users.findOneAndUpdate(
      { email: email },
      { accessToken, username },
      { new: true }
    );
    if (userDoc) exists = true;
    res.locals.exists = exists;
    console.log('res.locals.exists', res.locals.exists);
    console.log('leaving addToken');
    return next();
  } catch (err) {
    return next({
      log: `userController.updateUserSpotify ERROR: trouble updating spotify token to database`,
      message: {
        err: `userController.updateUserSpotify ERROR: ${err}`,
      },
    });
  }
};

module.exports = userController;
