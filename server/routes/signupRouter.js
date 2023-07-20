const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.post('/', userController.createUser, (req, res) => {
  return res.sendStatus(200);
});

module.exports = router;
