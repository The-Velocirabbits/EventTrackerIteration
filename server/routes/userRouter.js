const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.getCurrentUser, (req, res) => {
  return res.status(200).json(res.locals.currentUser);
});

module.exports = router;
