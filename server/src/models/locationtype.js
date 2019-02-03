'use strict';
module.exports = (sequelize, DataTypes) => {
  const LocationType = sequelize.define('LocationType', {
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  LocationType.associate = function(models) {
    // associations can be defined here
  };
  return LocationType;
};