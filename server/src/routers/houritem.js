const express = require('express');
const router = new express.Router();
const hourItemsController = require('../controllers').houritems;

router
    .get('/houritem', (req, res) => res.status(200).send({message: 'Welcome to the HourItem API!'}))
    .get('/houritems', hourItemsController.list)
    .get('/find_houritems/:hoursListId', hourItemsController.retrieve)
    .post('/add_houritem/:hoursListId', hourItemsController.create)
    .post('/update_houritems/:hoursListId', hourItemsController.update)
    .delete('/delete_houritems/:hoursListId', hourItemsController.destroy);

module.exports = router;
