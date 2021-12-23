const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table')
require('dotenv').config();

const PORT = process.env.PORT || 3001;

// creates connection to sql database
const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
},
console.log('connected to the employee_tracker database')
);

