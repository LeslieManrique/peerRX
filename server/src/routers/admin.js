const express = require("express");
const router = new express.Router();
const usersController = require('../controllers').users;
const interestController = require('../controllers').interest;
const {authenticateAdmin} = require('../services/auth');

router
    .get('/admin', authenticateAdmin, usersController.list);
router
    .get('/admin/interestedUsers', authenticateAdmin, interestController.list)
router
  .delete('/admin/interestedUsers/:id', authenticateAdmin, interestController.delInterestById)


module.exports = router;