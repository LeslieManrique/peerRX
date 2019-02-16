'use strict';
module.exports = (sequelize, DataTypes) => {
  const AgenciesLocations = sequelize.define('AgenciesLocations', {
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    agencyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  AgenciesLocations.associate = function(models) {
    // associations can be defined here
  };

  // remove the id column that is added in by sequelize when there is no primary key
  AgenciesLocations.removeAttribute('id');
  
  return AgenciesLocations;
};