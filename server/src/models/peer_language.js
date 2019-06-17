'use strict';
module.exports = (sequelize, DataTypes) => {
  const peer_language = sequelize.define('peer_language', {
    peer_languages_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    language_id:{
      type:DataTypes.INTEGER 
    },
    peer_id:{
        type:DataTypes.INTEGER 
    }
  }, {timestamps: false});
  peer_language.associate = function(models) {
    // associations can be defined here
    
  };
  return peer_language;
};