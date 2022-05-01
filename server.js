const express = require('express');
const mysql = require('mysql2');
const figlet = require('figlet');
const conTable = require('console.table');

// const api = require('./routes/index.js');
const inquirer = require('inquirer');
const { start } = require('repl');
const { response } = require('express');

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
        console.table(response);
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
    db.query(mysql, (error, response) => {
        if (error) throw error;
        console.table(response);
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
                   AND roles.id = employee.role_id`;
    db.query(mysql, (error, response) => {
        if (error) throw error;
        console.table(response);
        userPrompt();
    });
};

// Listen for localhost
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);