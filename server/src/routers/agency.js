const express = require('express');
const router = new express.Router();
const agencyController = require('../controllers').agencies;

router
    .get('/agency', (req, res) => res.status(200).send({
            message: 'Welcome to the Agencies API!'
    }))
    .post('/add_agency/:userId', agencyController.create)
    .get('/agencies', agencyController.list)
    .get('/find_agency/:userId', agencyController.retrieve)
    .post('/update_agency/:userId', agencyController.update)
    .delete('/delete_agency/:userId', agencyController.destroy);

module.exports = router;