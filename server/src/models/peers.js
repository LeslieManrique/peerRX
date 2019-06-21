'use strict';
module.exports = (sequelize, DataTypes) => {
  const peer = sequelize.define('peers', {
    peer_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email_address:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {msg: 'Email is invalid'}
      }
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address1:{
      type:DataTypes.STRING
    },
    /*address2:{
      type:DataTypes.STRING
    },*/
    city:{
      type:DataTypes.STRING
    },
    state:{
      type:DataTypes.STRING
    },
    zipcode:{
      type:DataTypes.STRING
    },
    specialty: {
      type: DataTypes.STRING
    },
    age_range_start:{
      type: DataTypes.INTEGER
    },
    age_range_end:{
      type: DataTypes.INTEGER
    },
    language: {
      type: DataTypes.STRING
    },
    gender: {
      type: DataTypes.STRING
    },
    rank: {
      type: DataTypes.INTEGER
    },
    certification: {
      type: DataTypes.STRING
    },
    certification_expiration_date:{
      type: DataTypes.DATE 
    },
    licensure:{
      type: DataTypes.STRING
    },
    training_1: {
      type: DataTypes.STRING
    },
    /*training_2: {
      type: DataTypes.STRING
    },
    training_3: {
      type: DataTypes.STRING
    },*/
    on_site_location:{
      type:DataTypes.STRING
    },
    on_site_location:{
      type:DataTypes.STRING
    },
    on_site:{
      type:DataTypes.INTEGER
    },
    available:{
      type:DataTypes.INTEGER
    },
    supervisor_name:{
      type:DataTypes.STRING
    },
    supervisor_phone_number:{
      type:DataTypes.STRING
    },
    coordinate_point:{
      type:DataTypes.STRING
    },
    user_id:{
      type:DataTypes.INTEGER 
    }
  }, {timestamps: false});

  peer.associate = function(models) {
    // associations can be defined here
    
  };
  return peer;
};