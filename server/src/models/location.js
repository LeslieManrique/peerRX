'use strict';
module.exports = (sequelize, DataTypes) => {
  const locations = sequelize.define('locations', {
    location_id:{
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
    on_site_peers:{
      type: DataTypes.BOOLEAN,
      defaultValue:false,
      allowNull: false
    },
    location_type: {
      type: DataTypes.INTEGER
    }
   
  }, {timestamps: false});
  locations.associate = function(models) {
    // associations can be defined here

    // a Location is a type of User
    // Location.belongsTo(models.users, {
    //   primaryKey: 'userId',
    //   onDelete: 'CASCADE'
    // });
  };
  return locations;
};

//add before save functuon that populates coordinates 