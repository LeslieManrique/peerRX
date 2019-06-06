'use strict';
module.exports = (sequelize, DataTypes) => {
  const agencies = sequelize.define('agencies', {
    agency_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
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
    main_contact_first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    main_contact_last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    main_contact_phone_number:{
      type: DataTypes.STRING,
      allowNull: false
    },
    main_contact_email_address:{
      type: DataTypes.STRING,
      allowNull: false
    },
    open_hour:{
      type: DataTypes.STRING,
      allowNull: false
    },
    closing_hour:{
      type: DataTypes.STRING,
      allowNull: false
    },

  }, {
    timestamps: false
  });
  
  agencies.associate = function(models) {
    // associations can be defined here

    // an Agency is a type of User
    // agencies.belongsTo(models.users, {
    // 	primaryKey: 'agency_id',
    // 	onDelete: 'CASCADE'
    // });
  };
  
  return agencies;
};