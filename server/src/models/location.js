'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    userId:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    location_type: {
      type: DataTypes.INTEGER
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zipcode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    coordinate_point: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Location.associate = function(models) {
    // associations can be defined here

    // a Location is a type of User
    Location.belongsTo(models.users, {
      primaryKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Location;
};