'use strict';
module.exports = (sequelize, DataTypes) => {
  const Peer = sequelize.define('Peer', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    certifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    training_certs: {
      type: DataTypes.STRING
    }
  }, {});

  Peer.associate = function(models) {
    // associations can be defined here
    
    // a Peer is a type of User
    Peer.belongsTo(models.users, {
      primaryKey: 'userId',
    	onDelete: 'CASCADE'
    });
  };
  return Peer;
};