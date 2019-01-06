const express = require("express");
const router = new express.Router();
const interestController = require('../controllers').interest;


router
  .post('/interest', interestController.validate('submitInterest'), interestController.create)
  .get('/interest', interestController.list);

module.exports = router;