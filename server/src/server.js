const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//app imports
const { userRouter } = require('./routers'); //require our routes/

// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// const CLIENT_BUILD_PATH = path.join(__dirname, '../../client/build');

// App
const app = express();

// Static files
// app.use(express.static(CLIENT_BUILD_PATH));

//Parse incoming requests 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


// API
app.get('/',(req,res)=>{
  return res.redirect('/users')
})

app.get('/api', (req, res) => {
  res.set('Content-Type', 'application/json');
  let data = {
    message: 'Hello world, Woooooeeeee!!!!\nImma take you home with meeee (Tpain)'
  };
  res.send(JSON.stringify(data, null, 2));
});
app.get('/api/torb', (req, res) => {
  res.set('Content-Type', 'application/json');
  let data = {
    message: "You're making a chiken out of a feather!"
  };
  res.send(JSON.stringify(data, null, 2));
});
app.use(userRouter);
// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.send('Welcome to the beginning of nothingness!')
  // response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

