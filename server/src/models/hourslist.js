'use strict';
module.exports = (sequelize, DataTypes) => {
  const HoursList = sequelize.define('HoursList', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
  }, {});

  HoursList.associate = function(models) {
    // associations can be defined here
    
    // an HoursList belongs to a User
    HoursList.belongsTo(models.users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return HoursList;
};