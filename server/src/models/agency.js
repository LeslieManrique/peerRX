'use strict';
module.exports = (sequelize, DataTypes) => {
  const Agency = sequelize.define('Agency', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: true
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
  
  Agency.associate = function(models) {
    // associations can be defined here

    // an Agency is a type of User
    Agency.belongsTo(models.users, {
    	primaryKey: 'userId',
    	onDelete: 'CASCADE'
    });
  };
  
  return Agency;
};