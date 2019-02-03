'use strict';
module.exports = (sequelize, DataTypes) => {
  const SpecialtyItem = sequelize.define('SpecialtyItem', {
    description: {
      type: DataTypes.STRING,
      allowNull:false
    }
  }, {});
  SpecialtyItem.associate = function(models) {
    // associations can be defined here
  };
  return SpecialtyItem;
};