let mysql = require('mysql');

let conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'libreria'
});

conexion.connect(function(error) {
    if (error)
        console.log('Problemas de conexion con mysql');
    else
        console.log('Conexion exitosa con mysql');
});

module.exports = conexion;

