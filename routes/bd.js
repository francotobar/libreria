let mysql = require('mysql');


let conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

conexion.connect(function(error) {
    if (error)
        console.log('Problemas de conexion con mysql');
    else
        console.log('Conexion exitosa con mysql');
});

module.exports = conexion;

