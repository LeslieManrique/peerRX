const request = require('request');
// returns latitude, longitude coordinates of an address as a string
function getCoordinatePoint(address1, address2, city, state, zipcode){
    // TODO: call to google API to get lat,lng value for given address

    // for now, return "LAT, LNG"
    const api_key = 'AIzaSyA0-MhQbt1EKRMfIPHm3WdCbC_fzpmUXAA'
    const full_address = encodeURIComponent(address1 + ',' + address2 + ',' + city + ',' + state + ',' + zipcode);
    console.log(full_address);
    // const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${full_address}&key=${api_key}`

    // console.log(url);
    // request(url, { json: true }, (err, res, body) => {
    //     console.log("sent url", url)
    //     if (!err && res.statusCode == 200){
    //         console.log(body.url);
    //         console.log(body.explanation);
    //     }
    //     else{
    //         console.log(err);
    //     }
        
    // });
    
    return "LAT, LNG"
}

module.exports = {
    getCoordinatePoint
};