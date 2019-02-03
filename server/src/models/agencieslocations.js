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
  return AgenciesLocations;
};