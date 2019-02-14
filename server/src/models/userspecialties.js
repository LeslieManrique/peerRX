'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserSpecialties = sequelize.define('UserSpecialties', {
    specialtyId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull:false
    }
  }, {});
  UserSpecialties.associate = function(models) {
    // associations can be defined here
  };

  // remove the id column that is added in by sequelize when there is no primary key
  UserSpecialties.removeAttribute('id');
  return UserSpecialties;
};