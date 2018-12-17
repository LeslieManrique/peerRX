const express = require("express");
const router = new express.Router();
const usersController = require('../controllers').users;

const users = [];
let id = 1;


router
  .post('/users', usersController.create);

//testing router 
// router
//   .route("/users")
//   .get((req,res,next) => {
//     return res.json(users);
//   })
//   .post((req,res,next) => {
//     users.push({
//       name: req.body.name,
//       id: ++id
//     });
//     return res.json({ message: "Created" });
//   });

// router 
//   .route("/users/:id")
//   .get((req, res) => {
//     const user = users.find(val => val.id === Number(req.params.id));
//     return res.json(user);
//   })
//   .patch((req, res) => {
//     user.name = req.body.name;
//     return res.json({ message: "Updated" });
//   })
//   .delete((req, res) => {
//     users.splice(user.id, 1);
//     return res.json({ message: "Deleted" });
//   });

module.exports = router;