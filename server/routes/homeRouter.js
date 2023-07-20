const express = require('express');
const seatGeekController = require('../controllers/seatGeekController.js');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.get(
  '/artist',
  userController.getUserInfo,
  seatGeekController.getArtistEvents,
  (req, res) => {
    return res.status(200).json(res.locals.artistEvents);
  }
);

router.get(
  '/genre',
  userController.getUserInfo,
  seatGeekController.getGenreEvents,
  (req, res) => {
    return res.status(200).json(res.locals.genreEvents);
  }
);

module.exports = router;
