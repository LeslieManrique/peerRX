'use strict';
module.exports = (sequelize, DataTypes) => {
  const interest = sequelize.define('interest', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    user_type: DataTypes.TINYINT
  }, {});
  interest.associate = function(models) {
    // associations can be defined here
  };
  return interest;
};