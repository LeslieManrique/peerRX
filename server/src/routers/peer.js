const express = require('express');
const router = new express.Router();
const peerController = require('../controllers').peers;
const {authenticateAdmin, authenticatePeer, authenticateGeneral, isApproved, canAccessParam} = require('../services/auth');

router
    .post('/peer/add/:userId', peerController.create)
    .get('/peer/list/:userId', [authenticateGeneral, isApproved, canAccessParam], peerController.list)
    .put('/peer/update/:userId/:peerId', [authenticateGeneral, isApproved, canAccessParam], peerController.update)
    .delete('/peer/delete/:userId/:peerId', [authenticateGeneral, isApproved, canAccessParam], peerController.destroy);

module.exports = router;