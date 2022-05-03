const express = require('express');
const mysql = require('mysql2');
const figlet = require('figlet');
const conTable = require('console.table');

// const api = require('./routes/index.js');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'manager_db'
    }
);

// Iniatial prompt for user
const userPrompt = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'userChoice',
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Quit",
            ]
        }
    ])
        .then(empChoice => {
            switch (empChoice.userChoice) {
                case "View all departments":
                    getAllDep();
                    break;
                case "View all roles":
                    getAllRoles();
                    break;
                case "View all employees":
                    getAllEmp();
                    break;
                case "Add a department":
                    addDept();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmp();
                    break;
                case "Update an employee role":
                    updateEmp();
                    break;
                case "Quit":
                    db.end();
                    console.log(`Thank you for using the Slacker Employee Tracker!`)
            }
        });
};
userPrompt();

// Lists all Departments
const getAllDep = () => {
    const mysql = `SELECT department.id AS id, department.dep_name AS department FROM department;`;
    db.query(mysql, (error, response) => {
        if (error) throw error;
        console.table("\n", response, "\n");
        userPrompt();
    });
};

// List all Roles
const getAllRoles = () => {
    const mysql = `SELECT roles.id, 
                   roles.title, 
                   department.dep_name AS department, 
                   roles.salary AS salary 
                   FROM roles 
                   INNER JOIN department 
                   ON roles.department_id = department.id;`;
    db.promise().query(mysql, (error, response) => {
        if (error) throw error;
        console.table("\n", response, "\n");
        userPrompt();
    });
};

// List all Employees
const getAllEmp = () => {
    const mysql = `SELECT employee.id,
                   employee.first_name AS First,
                   employee.last_name AS Last,
                   roles.title AS Title,
                   department.dep_name AS Department,
                   roles.salary AS Salary,
                   employee.manager_id AS Manager
                   FROM employee, roles, department
                   WHERE department.id = roles.department_id
                   AND roles.id = employee.role_id
                   ORDER BY employee.id ASC;`;
    db.query(mysql, (error, response) => {
        if (error) throw error;
        console.table("\n", response, "\n");
        userPrompt();
    });
};

const addRole = () => {
    const mysql = `SELECT department.id AS id, department.dep_name AS department FROM department;`;
    db.query(mysql, (error, response) => {
        if (error) throw error;
        console.table(response);
        inquirer.prompt([
            {
                type: 'input',
                name: 'deptId',
                message: "What is the Department ID # this roles belongs to?"
            },
            {
                type: 'input',
                name: 'newRole',
                message: "What is the title of the new role?"
            },
            {
                type: 'input',
                name: 'newSalray',
                message: "What is the salary of the new role?"
            }
        ])
        .then((answer) => {
            const newRole = answer.newRole;
            const newDeptId = answer.deptId;
            const newSalray = answer.newSalray;
            const mysql = `INSERT INTO roles (title, salary, department_id) VALUES ("${newRole}", "${newSalray}", "${newDeptId}")`;
            db.query(mysql, (error, response) => {
                if(error) throw error;
                console.log("\n", newRole + " has been added!", "\n");
                userPrompt();
            })
        });
    });
};
    const addDept = () => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'newDept',
                message: "What is the name of the new department?"
            },
        ])
            .then((answer) => {
                const mysql = `INSERT INTO department (dep_name) VALUES (?)`;
                db.query(mysql, answer.newDept, (error, response) => {
                    if (error) throw error;
                    console.log("\n", answer.newDept + ' Department has been added!', "\n");
                });
                getAllDep();
            });
    };


    // Listen for localhost
    app.listen(PORT, () =>
        console.log(`Example app listening at http://localhost:${PORT}`)
    );