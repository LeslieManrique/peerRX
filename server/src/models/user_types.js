'use strict';

module.exports = (sequelize, DataTypes) => {
  const user_types = sequelize.define('user_types', {
    user_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    user_type_name: {type: DataTypes.STRING, allowNull: false}, 
    user_table: {type: DataTypes.STRING, allowNull: false}, 
  }, {
    timestamps: false
  });
  user_types.associate = function(models) {
    // associations can be defined here
  };

  return user_types;

};



