const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const db = require('./db/connection');
const { printTable } = require('console-table-printer');

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
// shows id and dept name
function viewDepts() {
    console.log("Viewing departments\n");
    const sql = `SELECT * FROM department`

    db.query(sql, (err, res) => {
        if (err) throw err;

        printTable(res)
        promptUser();
    });
}

// shows role id, title, dept, salary
function viewRoles() {
    console.log("Viewing roles\n");
    const sql = `SELECT * FROM role`

    db.query(sql, (err, res) => {
        if (err) throw err;

        printTable(res)
        promptUser();
    });
}

// shows id, first, last, title, dept, salary, manager/null
function viewEmployees() {
    console.log("Viewing employees\n");
    const sql = `SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS name, CONCAT(manager.first_name, " ", manager.last_name) AS manager, role.title, role.salary, department.department_name AS department FROM employee LEFT JOIN role on employee.role_id=role.id LEFT JOIN department on role.department_id=department.id LEFT JOIN employee manager on manager.id=employee.manager_id`

    db.query(sql, (err, res) => {
        if (err) throw err;

        printTable(res)
        promptUser();
    });
}

function addDept() {
    console.log("Adding department\n");
    inquirer.prompt({
        type: 'input',
        name: 'dept_name',
        message: 'What is the name of the department?',
    }).then(answer => {
        const dbobject = { department_name: answer.dept_name }
        const sql = `INSERT INTO department SET ?`
        db.query(sql, dbobject, (err, res) => {
            if (err) throw err;

            viewDepts();
        });
    })
}

function addRole() {
    console.log("Adding role\n");
    db.promise().query('SELECT * FROM department').then(([rows]) => {
        let departments = rows;
        const deptChoices = departments.map(({ id, department_name }) => ({
            name: department_name,
            value: id
        })
    );
        inquirer.prompt([
            {
                type: 'input',
                name: 'role_title',
                message: 'What is the name of the role?',
            },
            {
                type: 'list',
                name: 'dept_choices',
                message: 'What department is this role located in?',
                choices: deptChoices
            },
        ]).then(answers => console.log(answers))
    })}

function addEmployee() {
            console.log("Adding employee\n");
        }

function updateEmpRole() {
            console.log("Updating employee role\n");
        }