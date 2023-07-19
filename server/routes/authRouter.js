const express = require('express');

// add in any controllers
const authController = require('../controllers/authController');
const spotifyController = require('../controllers/spotifyController');
const userController = require('../controllers/userController');

const router = express.Router();

// initially request user authentication from Spotify
router.get('/', authController.initializeAuth, (req, res) => {
  console.log('reached authentication router.get redirect');
  return res.status(200).json(res.locals.reqAuthentication);
});

// user is redirected here from spotify after entering their credentials
// if the user's credentials were authenticated, make get request to obtain refresh and access tokens from spotify
// TODO: if succesful, send the logged res.locals info to server to store for duration of user session
router.get(
  '/callback',
  authController.checkState,
  authController.getTokens,
  (req, res) => {
    console.log('finished processing')
    console.log('access token: ', res.locals.access_token);
    console.log('refresh token: ', res.locals.refresh_token);
    return res.status(200).json(res.locals.access_token);
  }
);

// TODO: get user email from spotify and check if the user exists in the database

router.post(
  '/email',
  spotifyController.getAccountInfo,
  userController.getUserInfo,
  userController.createUser,
  userController.setUser,
  (req, res) => {
    return res.status(200).json(res.locals.exists);
  }
);

module.exports = router;
