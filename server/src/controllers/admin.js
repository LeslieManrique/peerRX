const adminQueries = require('../queries/adminQueries')

const getRequestsForAdmin = async(req, res, next) =>{
    adminQueries.adminRequestList()
    .then(response=> {
        console.log(response);
        var requestList=[];
        
        response.map(request=>{
            var time = new Date(request.created_at)
            var am_pm = (time.getHours() < 12) ? "am" : "pm";
            var hour = (time.getHours() < 12) ? time.getHours() : time.getHours() - 12;
            var options = {year: 'numeric', month: 'long', day: 'numeric' }

            requestList.push(
                {   
                    date:time.toLocaleDateString("en-US", options),
                    time:hour+':'+time.getMinutes()+':'+time.getSeconds()+' '+am_pm,
                    locationName: request.name,
                    peerType: request.specialty,
                    peerName:request.first_name+' '+request.last_name

                }
            )
        })
        res.send(requestList);
    })
    .catch(err => {
        next(err);
    })
}

const getAgenciesForAdmin = async(req, res) =>{
    console.log("Getting agencies");
    const table = 'agencies';
    const obj = {}
    console.log(req);
    if(req.query.state){
        console.log("1");
        obj.state = req.query.state;
    }
    if(req.query.zipcode){
        console.log("2");
        obj.zipcode = req.query.zipcode;
    }
    try{
        const data = await getAgenciesQuery(obj, table);
        return res.status(200).send(data)
    }
    catch(error){
        console.log(error);
        return res.status(400).send(error);
    }

}
const getLocationsForAdmin = async(req, res) =>{
    console.log("Getting locations");
    const table = 'locations';
    const obj = {}
    console.log(req);
    if(req.query.state){
        console.log("1");
        obj.state = req.query.state;
    }
    if(req.query.zipcode){
        console.log("2");
        obj.zipcode = req.query.zipcode;
    }
    try{
        const data = await getLocationsQuery(obj, table);
        return res.status(200).send(data)
    }
    catch(error){
        console.log(error);
        return res.status(400).send(error);
    }

}

const getRequestReportForAdmin = async(req, res, next) =>{
    adminQueries.adminRequestReport()
    .then(response=> {
        console.log(response);
        var requestList=[];
        
        response.map(request=>{
            var time = new Date(request.created_at)
            var am_pm = (time.getHours() < 12) ? "am" : "pm";
            var hour = (time.getHours() < 12) ? time.getHours() : time.getHours() - 12;
            var options = {year: 'numeric', month: 'long', day: 'numeric' }

            requestList.push(
                {   
                    date:time.toLocaleDateString("en-US", options),
                    time:hour+':'+time.getMinutes()+':'+time.getSeconds()+' '+am_pm,
                    locationName: request.location_name,
                    state: request.state,
                    county: request.county,
                    specialty: request.specialty,
                    gender: request.gender_preference,
                    language: request.language_preference,
                    age: request.age_range,
                    status: request.status,
                    agency: request.agency_name,
                    peerName:request.first_name+' '+request.last_name

                }
            )
        })
        res.send(requestList);
    })
    .catch(err => {
        next(err);
    })
}



// this will always be on the end of the file
module.exports = {
    getRequestsForAdmin,
    getAgenciesForAdmin,
    getLocationsForAdmin,
    getRequestReportForAdmin    
};

