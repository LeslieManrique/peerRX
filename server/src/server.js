const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator')
const http = require('http');
//app imports
const { userRouter, interestRouter, agencyRouter, peerRouter, locationRouter, agenciesLocationsRouter, agenciesPeersRouter,
        hoursListRouter, hourItemRouter, userSpecialtiesRouter, signupRouter, adminRouter, loginRouter } = require('./routers'); //require our routes/
// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// const CLIENT_BUILD_PATH = path.join(__dirname, '../../client/build');

// App
const app = express();

// Static files
// app.use(express.static(CLIENT_BUILD_PATH));
app.use(logger('dev'));

//middleware 
//require('./services/auth');

//Parse incoming requests 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(expressValidator())


// API
app.get('/',(req,res)=>{
  return res.redirect('/login')
})

app.get('/api', (req, res) => {
  res.set('Content-Type', 'application/json');
  let data = {
    message: 'Nothing Here Yet UwU'
  };
  res.send(JSON.stringify(data, null, 2));
});

app.use(userRouter);
app.use(interestRouter);
app.use(signupRouter);
app.use(loginRouter);
app.use(adminRouter);

app.use(agencyRouter);
app.use(peerRouter);
app.use(locationRouter);
app.use(agenciesLocationsRouter);
app.use(agenciesPeersRouter);
app.use(hoursListRouter);
app.use(hourItemRouter);
app.use(userSpecialtiesRouter);

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.send('Welcome to the beginning of nothingness!')
  // response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});
//Handle errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error : err });
});
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

