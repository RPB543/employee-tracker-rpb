const mysql = require('mysql2');
const inquirer = require('inquirer');
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
            'Add Role',
            'Add Employee',
            'Update Employee Role',
            'Remove Department',
            'Remove Role',
            'Remove Employee',
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
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmpRole();
                    break;
                case 'Remove Department':
                    removeDept();
                    break;
                case 'Remove Role':
                    removeRole();
                    break;
                case 'Remove Employee':
                    removeEmployee();
                    break;
                case "Quit":
                    db.end();
                    break;
            }
        });
}
// shows id and dept name
function viewDepts() {
    const sql = `SELECT id, department_name AS name FROM department`

    db.query(sql, (err, res) => {
        if (err) throw err;

        printTable(res)
        promptUser();
    });
}

// shows role id, title, dept, salary
function viewRoles() {
    const sql = `SELECT role.id, role.title, department.department_name AS department, role.salary FROM role LEFT JOIN department on role.department_id=department.id\n`

    db.query(sql, (err, res) => {
        if (err) throw err;

        printTable(res)
        promptUser();
    });
}

// shows id, first, last, title, dept, salary, manager/null
function viewEmployees() {
    const sql = `SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id=role.id LEFT JOIN department on role.department_id=department.id LEFT JOIN employee manager on manager.id=employee.manager_id\n`

    db.query(sql, (err, res) => {
        if (err) throw err;

        printTable(res)
        promptUser();
    });
}

// adds dept to database
function addDept() {
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

// adds role to database with job title, salary, and the dept it belongs to
function addRole() {
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
                type: 'input',
                name: 'role_salary',
                message: 'What is the salary of the role?',
            },
            {
                type: 'list',
                name: 'dept_choices',
                message: 'What department is this role located in?',
                choices: deptChoices
            },
        ]).then(answers => {
            const dbobject = { title: answers.role_title, salary: answers.role_salary, department_id: answers.dept_choices }
            const sql = `INSERT INTO role SET ?`
            db.query(sql, dbobject, (err, res) => {
                if (err) throw err;

                viewRoles();
            })
        })
    });
}

// retrieves role ID and name from role database
function addEmployee() {
    db.query("SELECT * FROM role", function (err, data) {
        const roleChoices = []
        if (err) throw err;
        for (i = 0; i < data.length; i++) {
            roleChoices.push(data[i].id + "-" + data[i].title)
        }
        employeeInsert(roleChoices)
    })
}

// retrieves manager ID and name from employee database
function employeeInsert(roleChoices) {
    const managerChoices = []
    db.query("SELECT * FROM employee", function (err, data) {
        if (err) throw err;
        for (i = 0; i < data.length; i++) {
            managerChoices.push(data[i].id + "-" + data[i].first_name + " " + data[i].last_name)
        }
        employeeNew(roleChoices, managerChoices);
    })
}

// adds employee to database with first name, last name, role, manager
function employeeNew(roleChoices, managerChoices) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employee_first',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'employee_last',
            message: 'What is the last name of the employee?',
        },
        {
            type: 'list',
            name: 'employee_title',
            message: 'What is the role of the employee?',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'manager_choices',
            message: 'What is the manager of the employee?',
            choices: managerChoices
        },
    ]).then(answers => {
        var getRoleId = answers.employee_title.split("-")
        var getManagerId = answers.manager_choices.split("-")
        const dbobject = { first_name: answers.employee_first, last_name: answers.employee_last, role_id: getRoleId[0], manager_id: getManagerId[0] }
        const sql = `INSERT INTO employee SET ?`
        db.query(sql, dbobject, (err, res) => {
            if (err) throw err;

            viewEmployees();
        })
    })
}

// retrieves employee Array
function updateEmpRole() {
    const sql = `SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS name FROM employee`

    db.query(sql, (err, res) => {
        if (err) throw err;

        const employeeArr = res.map(({ id, name }) => ({
            value: id, name: name
        }));
        roleArr(employeeArr);
    });
}

// retrieves role Array
function roleArr(employeeArr) {
    const sql = `SELECT role.id, role.title FROM role`

    db.query(sql, (err, res) => {
        if (err) throw err;

        const roleArr = res.map(({ id, title }) => ({
            value: id, name: title
        }));
        updateEmployee(employeeArr, roleArr);
    });
}

// update employee role
function updateEmployee(employeeArr, roleArr) {
    inquirer.prompt([
        {
            type: "list",
            name: "employee_name",
            message: "Which employee's role would you like to update?",
            choices: employeeArr
        },
        {
            type: "list",
            name: "role_name",
            message: "What is the employee's new position?",
            choices: roleArr
        }
    ]).then(function (answer) {

        const sql = `UPDATE employee SET role_id = ? WHERE id = ?`
        db.query(sql, [answer.role_name, answer.employee_name], (err, res) => {
            if (err) throw err;

            viewEmployees();
        })
    })
}

// retrieves employees for deletion
function removeEmployee() {
    const sql = `SELECT * FROM employee`

    db.query(sql, (err, res) => {
        if (err) throw err;

        const removeEmpChoices = res.map(({ id, first_name, last_name }) => ({
            value: id, name: `${id} ${first_name} ${last_name}`
        }));

        deleteEmployee(removeEmpChoices);
    });
}

// deletes employee
function deleteEmployee(removeEmpChoices) {
    inquirer.prompt(
        {
            type: "list",
            name: "employee_id",
            message: "Which employee would you like to remove?",
            choices: removeEmpChoices
        }
    )
        .then(function (answer) {
            const sql = `DELETE FROM employee WHERE ?`

            db.query(sql, { id: answer.employee_id }, (err, res) => {
                if (err) throw err;

                viewEmployees();
            })
        })
}

// retrieves depts for deletion
function removeDept() {
    const sql = `SELECT * FROM department`

    db.query(sql, (err, res) => {
        if (err) throw err;

        const removeDeptChoices = res.map(({ id, department_name }) => ({
            value: id, name: department_name
        }));

        deleteDept(removeDeptChoices);
    });
};

// removes department
function deleteDept(removeDeptChoices) {
    inquirer.prompt(
        {
            type: "list",
            name: "dp_id",
            message: "Which department would you like to remove?",
            choices: removeDeptChoices
        }
    )
        .then(function (answer) {
            const sql = `DELETE FROM department WHERE ?`

            db.query(sql, { id: answer.dp_id }, (err, res) => {
                if (err) throw err;

                viewDepts();
            })
        })
};

// retreives roles for deletion
function removeRole() {
    const sql = `SELECT * FROM role`

    db.query(sql, (err, res) => {
        if (err) throw err;

        const removeRoleChoices = res.map(({ id, title }) => ({
            value: id, name: title
        }));

        deleteRole(removeRoleChoices);
    });
};

// removes role
function deleteRole(removeRoleChoices) {
    inquirer.prompt(
        {
            type: "list",
            name: "roles_id",
            message: "Which department would you like to remove?",
            choices: removeRoleChoices
        }
    )
        .then(function (answer) {
            const sql = `DELETE FROM role WHERE ?`

            db.query(sql, { id: answer.roles_id }, (err, res) => {
                if (err) throw err;

                viewRoles();
            })
        })
};