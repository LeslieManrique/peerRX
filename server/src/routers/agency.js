const express = require('express');
const router = new express.Router();
const agencyController = require('../controllers').agencies;
const {authenticateAdmin, authenticateAgency, isApproved, canAccessParam} = require('../services/auth');


router
    .post('/agency/add/:userId', authenticateAgency, agencyController.create)
    //.post('/add_agency/:userId', agencyController.create)
    // .get('/agency/all', [authenticateAdmin, isApproved], agencyController.list)

    .get('/profile/agency/:userId', [authenticateAgency, canAccessParam], agencyController.retrieve)
    //.get('/find_agency/:userId', agencyController.retrieve)
    .get('/agency/public/list', agencyController.getAgencies)
    .put('/agency/update/:userId',[authenticateAgency], agencyController.update)

    //.post('/update_agency/:userId', agencyController.update)
    .post('/agency/delete/userId', [authenticateAdmin, isApproved], agencyController.destroy)
    .post('/admin/approve/:id', [authenticateAgency, isApproved], function(req, res, next){
        usersController.approveUser("agency", req, res);
    })
    
    //.delete('/delete_agency/:userId', agencyController.destroy);
    //TODO: An agency can approve a peer
    //.post('agency/approve_peer/:peerId', [authenticateAgency, isApproved], agencyController.approve)

module.exports = router;