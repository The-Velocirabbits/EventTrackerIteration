const { Users } = require('../models/userModels');

const userController = {};

//fetching user document from 'Users' collection in database
userController.getUserInfo = async (req, res, next) => {
  const email = req.body.email;
  if (!email)
    return next({
      log: `userController.postUserInfo ERROR: fourteener peak name missing`,
      message: {
        err: 'userController.postUserInfo: ERROR: fourteener peak name missing',
      },
    });
  try {
    const userInfo = await Users.find({ email });
    res.locals.userInfo = userInfo;
    /* 
    Expect userInfo to come back as:
    { 
    Email: String,
    Location: {
        City: String,
        State: String,
        }
    Artists: [Artist1, Artist2, Artist3]
    Genres: [Genre1, Genre2, Genre3]
    }
    */
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
  try {
    const { email, location } = req.body;
    const newUser = await Users.create({email: email, location: location});
    res.locals.newUser = newUser;
    return next();
  }
  catch (err) {
    return next({
      log: `userController.createUser ERROR: trouble creating new user`,
      message: {
        err: `userController.createUser ERROR: ${err}`
      }
    })
  }
};


userController.updateUser = async (req, res, next) => {
  
  // to grab the email of patch request
  //api/preference
  // email = req.query.email
}


module.exports = userController;
