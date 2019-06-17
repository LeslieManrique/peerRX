'use strict';
module.exports = (sequelize, DataTypes) => {
  const language = sequelize.define('language', {
    language_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    language:{
      type:DataTypes.STRING 
    }
  }, {timestamps: false});

  language.associate = function(models) {
    // associations can be defined here
    
  };
  return language;
};