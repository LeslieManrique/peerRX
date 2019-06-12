const sequelize = require('../models').sequelize;

const adminRequestList = () =>{
    console.log("admin request list for Dashboard")
    const query = "SELECT lr.created_at, l.name, lr.specialty, p.first_name, p.last_name FROM location_requests as lr INNER JOIN peers as p ON lr.peer_id = p.peer_id INNER JOIN locations as l ON l.location_id = lr.location_id;"

    return sequelize
        .query(query, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(requestList => {
            return requestList;
        });

}

const adminRequestReport = () =>{
    console.log("admin request list for Dashboard")
    const query = "SELECT lr.created_at, l.name as location_name, l.state, l.county, lr.specialty, lr.gender_preference, lr.language_preference, lr.age_range, lr.status, a.name as agency_name, p.first_name, p.last_name FROM location_requests as lr INNER JOIN peers as p ON lr.peer_id = p.peer_id INNER JOIN locations as l ON l.location_id = lr.location_id INNER JOIN agencies as a ON p.user_id = a.agency_id";

    return sequelize
        .query(query, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(requestList => {
            return requestList;
        });

}

const getAgenciesQuery = async(obj, table) => {
    console.log('obj -- ', obj);
    console.log('table --',table);
    const cols = '`name`, `phone_number`, `address1`, `address2`, `city`, `state`, `zipcode`';
    let getQuery = 'SELECT users.id, agencies.name, users.email_address, agencies.address1, agencies.phone_number, users.approved FROM agencies INNER JOIN users ON agencies.user_id = users.id;'
    
    console.log(getQuery);
    
    return sequelize
        .query(getQuery, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(res => {
            if(!res){
                return new Error("No data retrieved.");
            }
            return res; 
        })
        .catch(error => console.log("error--",error));


}

const getLocationsQuery = async(obj, table) => {
    console.log('obj -- ', obj);
    console.log('table --',table);
    const cols = '`name`, `phone_number`, `address1`, `address2`, `city`, `state`, `zipcode`';
    let getQuery = 'SELECT  users.id, locations.name, users.email_address, locations.address1, locations.phone_number, users.approved FROM locations INNER JOIN users ON locations.location_id = users.id;'
    
    console.log(getQuery);
    
    return sequelize
        .query(getQuery, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(res => {
            if(!res){
                return new Error("No data retrieved.");
            }
            return res; 
        })
        .catch(error => console.log("error--",error));
}





// this will always be on the end of the file
module.exports = {
    adminRequestList,
    getAgenciesQuery,
    getLocationsQuery,
    adminRequestReport
};

