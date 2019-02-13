const express = require('express');
const router = new express.Router();
const userSpecialtiesController = require('../controllers').userspecialties;

router
    .get('/userspecialties', userSpecialtiesController.list)
    .get('/find_userspecialties/:userId', userSpecialtiesController.retrieve)
    .post('/add_userspecialties/:userId', userSpecialtiesController.create)
    .post('/update_userspecialties/:userId', userSpecialtiesController.update)
    .delete('/delete_userspecialties/:userId', userSpecialtiesController.destroy);

module.exports = router;