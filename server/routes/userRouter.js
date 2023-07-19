const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.getUserInfo, (req, res) => {
  return res.status(200).json(res.locals.userInfo);
});

module.exports = router;
