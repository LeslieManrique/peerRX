const mysql=require('mysql');
const NODE_ENV=process.env.NODE_ENV; 

const connection = mysql.createConnection({
  host     : process.env.HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,

  database : process.env.MYSQL_DATABASE
});

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected");
    } else {
        console.log("Error while connecting with database");
    }
});

module.exports = connection;