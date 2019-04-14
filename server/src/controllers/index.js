const users = require('./users');
const agencies = require('./agency');
const peers = require('./peer');
const locations = require('./location');
const agencieslocations = require('./agencieslocations');
const agenciespeers = require('./agenciespeers');
const houritems = require('./houritem');
const hourslist = require('./hourslist');
const specialtyitems = require('./specialtyitem');
const interest = require('./interest')

module.exports= {
    users,
    agencies,
    peers,
    locations,
    agencieslocations,
    agenciespeers,
    houritems,
    hourslist,
    specialtyitems,
    interest
};