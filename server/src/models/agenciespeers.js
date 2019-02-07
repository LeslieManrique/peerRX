'use strict';
module.exports = (sequelize, DataTypes) => {
  const AgenciesPeers = sequelize.define('AgenciesPeers', {
    peerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    agencyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  AgenciesPeers.associate = function(models) {
    // associations can be defined here
  };
  return AgenciesPeers;
};