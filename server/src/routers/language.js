const express = require("express");
const router = new express.Router();
const languageController = require('../controllers/language');
const peerLanguageController = require('../controllers/peer_language');

router
  //leave this for debugging only 
  .post('/language/add', languageController.createLanguage) //can create any type of user except admin
  .post('/peerLanguage/add', peerLanguageController.createPeerLanguage) //can create any type of user except admin

module.exports = router;