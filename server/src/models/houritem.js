'use strict';
module.exports = (sequelize, DataTypes) => {
  const HourItem = sequelize.define('HourItem', {
    day_of_week: {
      allowNull: false,
      type: DataTypes.ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')
    },
    time_in: {
      type: DataTypes.STRING,
      allowNull: false
    },
    time_out: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  
  HourItem.associate = function(models) {
    // associations can be defined here
    
    // HourItem belongs to an HoursList
    HourItem.belongsTo(models.HoursList, {
      foreignKey: 'hoursListId',
      onDelete: 'CASCADE'
    });
  };

  return HourItem;
};