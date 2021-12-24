const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table')
const db = require('./db/connection');

// start sever after DB connection
db.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    promptUser();
  });

// Prompt user to choose an option
function promptUser() {
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
        .then(function ({ task }) {
            //Switch case depending on user option
            switch (task) {
                case 'View All Departments':
                    viewDepts();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add Department':
                    addDept();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Update Employee Role':
                    updateEmpRole();
                    break;
                case "Quit":
                    db.end();
                    break;
            }
        });
}
// shows id and dpet name
function viewDepts() {
    console.log("Viewing departments\n");
    const sql = `SELECT * FROM departments`

    db.query(sql, (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        consoleTable(res)
        promptUser();
      });
}

// shows role id, title, dept, salary
function viewRoles() {
    console.log("Viewing roles\n");
}

// shows id, first, last, title, dept, salary, manager/null
function viewEmployees() {
    console.log("Viewing employees\n");
}

function addDept() {
    console.log("Adding department\n");
}

function addRole() {
    console.log("Adding role\n");
}

function addEmployee() {
    console.log("Adding employee\n");
}

function updateEmpRole() {
    console.log("Updating employee role\n");
}