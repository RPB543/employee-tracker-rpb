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

// Prompt user to choose an option
function promptUser(){
    inquirer.prompt({
        type: 'list',
        name: 'task',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add Department',
            'Add Employee',
            'Add Role',
            'Update Employee Role',
            'Quit',
            ]
    })
    //.then(function ({ task }) {
         // Switch case depending on user option
//         switch (task) {
//             case 'View All Departments':
//                 viewDepts();
//                 break;
//             case 'View All Roles':
//                 viewRoles();
//                 break;
//         }
//     }

// };
 promptUser();
