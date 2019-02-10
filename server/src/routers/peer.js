const express = require('express');
const router = new express.Router();
const peerController = require('../controllers').peers;

router
    .get('/peer', (req, res) => res.status(200).send({
            message: 'Welcome to the Peers API!'
    }))
    .post('/add_peer/:userId', peerController.create)
    .get('/peers', peerController.list)
    .get('/find_peer/:userId', peerController.retrieve)
    .post('/update_peer/:userId', peerController.update)
    .delete('/delete_peer/:userId', peerController.destroy);

module.exports = router;