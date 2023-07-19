const express = require('express');
const userController = require('../controllers/userController');
const spotifyController = require('../controllers/spotifyController.js');

const router = express.Router();

//Get user info from database to population preferences page
router.get(
  '/',
  userController.getUserInfo,
  spotifyController.getTopArtists,
  (req, res) => {
    const { email, location, artists, genres } = res.locals.userInfo;
    const newObj = {
      email: email,
      city: location.city,
      state: location.state,
      artists: artists,
      genres: genres,
    };
    return res.status(200).json(newObj);
  }
);

//Update artists or genres for each user in the database
router.patch('/', userController.updateUser, (req, res) => {
  return res.sendStatus(200);
});

module.exports = router;
