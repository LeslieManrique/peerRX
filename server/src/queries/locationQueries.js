const sequelize = require('../models').sequelize;
const location_requests = require('../models').location_requests
const VIEWABLE_REQUESTS_LOCATION_COLS = `location_requests.id,location_requests.created_at,agencies.name, peers.first_name,peers.last_name,location_requests.specialty`

const requestsList = (locationId) => {
    console.log('locationId:' + locationId)
    const joinQuery = `select ${VIEWABLE_REQUESTS_LOCATION_COLS}\
                         FROM peers\
                         INNER JOIN agencies ON agencies.agency_id = peers.user_id \ 
                         RIGHT JOIN location_requests ON location_requests.peer_id = peers.peer_id \
                         WHERE location_requests.location_id = '${locationId}'`;
    return sequelize
        .query(joinQuery, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(requestList => {
            return requestList;
        });
}

const requestsMade = (requestBody) => {
    const todayDate = new Date().toLocaleDateString()
    console.log(requestBody)
    return location_requests
    .create({   
                location_id : requestBody.location_id,
                request_type : requestBody.request_type,
                gender_preference : requestBody.gender_preference,
                language_preference : requestBody.language_preference,
                case : requestBody.case,
                age_range : requestBody.age_range,
                created_at : todayDate,
                note : null,
                times_requested : 0,
                expired_at : null,
                completed : null,
                peer_id : null,
                specialty : requestBody.specialty
        
    })
    .then(locationRequest => {
        return locationRequest.id;
    })
    .catch(error => {
        console.log(error);
        return null;
    });
}


// this will always be on the end of the file
module.exports.requestsList = requestsList
module.exports.requestsMade = requestsMade
// add all other exports

