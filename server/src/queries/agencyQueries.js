const sequelize = require('../models').sequelize;
//const agency = require('../models').agency
const VIEWABLE_REQUESTS_AGENCY_COLS = `p.peer_id as peerId, p.first_name as peerFirstname, p.last_name as peerLastname, p.email_address as peerEmail,\
p.phone_number as peerPhone, p.address1 as peerStreet, p.city as peerCity,p.age_range_start as peerStartAge,p.age_range_end as peerEndAge, p.state as peerState, p.zipcode as peerZip, p.specialty as peerSpecialty,\
p.language as peerLanguage, p.gender as peerGender,p.rank as peerRank, p.certification as peerCertification, p.certification_expiration_date as peerCertficationExpDate,\
p.licensure as peerLicensure, p.training_1 as peerTraining,p.on_site_location as peerSiteLocation,p.call_center as peerCallCenter,p.available as peerAvailable, p.supervisor_name as peerSupervisorName, p.supervisor_phone_number as peerSupervisorPhone`

const peerList = (agencyId) => {
    console.log('agencyId:' + agencyId)
    const joinQuery = `select ${VIEWABLE_REQUESTS_AGENCY_COLS}\
                         FROM peer_app_dev.agencies as a\
                         INNER JOIN peer_app_dev.peers as p on a.agency_id=p.user_id\
                         WHERE a.agency_id=${agencyId}`
    return sequelize
        .query(joinQuery, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(peerList => {
            return peerList;
        });
}

module.exports.peerList = peerList
