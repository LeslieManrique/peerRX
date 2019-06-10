'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    email_address: {type: DataTypes.STRING , 
      allowNull: false, 
      unique: {msg: 'An account exists with this email. Please try to login'},
      validate: {
        isEmail: {msg: 'Email is invalid'}
      }},
    password: {type: DataTypes.STRING, allowNull: false}, 
    user_type: {type: DataTypes.INTEGER, allowNull: false}, 
    approved: {type: DataTypes.BOOLEAN, defaultValue: 0} 
  }, {timestamps: false});
  users.associate = function(models) {
    // associations can be defined here
  };
  users.beforeSave(async(user, options) => {
    //this refers to the current document about to be saved
    //hash password with a salt round of 10
    const hash = await bcrypt.hash(user.password, 10);
    //replace password with hash and store it 
    user.password = hash;
    //indicates we are done and moves onto the next middleware 
  });

  //make sure user that is trying to log in has the correct credentials
  users.prototype.isValidPassword =  function(password) {
    const user = this;
    //Hashes the password sent by the user for login and checks if the hashed password stored in the 
    //database matches the one sent. Returns true if it does else false.
    const compare = bcrypt.compare(password, this.password).then((res)=>{return res});
    return compare
  };
  


  return users;

};
