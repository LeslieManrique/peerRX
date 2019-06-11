'use strict';
module.exports = (sequelize, DataTypes) => {
  const location_requests = sequelize.define('location_requests', {
    
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    request_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gender_preference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    language_preference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    case: {
      type: DataTypes.STRING,
      allowNull: true
    },
    age_range: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true
    },
    times_requested: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expired_at:{
      type: DataTypes.DATE,
      allowNull: true
    },
    completed:{
      type: DataTypes.INTEGER,
      allowNull: true
    },
    peer_id:{
      type: DataTypes.INTEGER,
      allowNull: true
    },
    specialty:{
      type: DataTypes.STRING,
      allowNull: true
    },

  }, {
    timestamps: false
  });
  
  location_requests.associate = function(models) {
    // associations can be defined here

    // an Agency is a type of User
    // agencies.belongsTo(models.users, {
    // 	primaryKey: 'agency_id',
    // 	onDelete: 'CASCADE'
    // });
  };
  
  return location_requests;
};