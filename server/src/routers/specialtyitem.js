const express = require('express');
const router = new express.Router();
const specialtyItemController = require('../controllers').specialtyitem;

router
    .get('/specialties', specialtyItemController.list)
    .post('/add_specialty', specialtyItemController.create)
    .delete('/delete_specialty', specialtyItemController.destroy);

module.exports = router;