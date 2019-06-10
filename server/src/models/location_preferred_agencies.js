'use strict';
module.exports = (sequelize, DataTypes) => {
  const location_agencies = sequelize.define('location_preferred_agencies', {
    location_id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    agency_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    }
   
  }, {timestamps: false});
  location_agencies.associate = function(models) {
    // associations can be defined here

    // a Location is a type of User
    // Location.belongsTo(models.users, {
    //   primaryKey: 'userId',
    //   onDelete: 'CASCADE'
    // });
  };
  return location_agencies;
};

//add before save functuon that populates coordinates 