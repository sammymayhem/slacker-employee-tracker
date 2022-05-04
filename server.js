const express = require('express');
const mysql = require('mysql2');
const figlet = require('figlet');
const conTable = require('console.table');

// const api = require('./routes/index.js');
const inquirer = require('inquirer');
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
                   ON roles.department_id = department.id
                   ORDER BY roles.id ASC;`;
    db.query(mysql, (error, response) => {
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

// Add a role to the roles table
const addRole = () => {
    const mysql = `SELECT * FROM department;`;
    db.query(mysql, (error, departments) => {
        if (error) throw error;
        let deptList = departments.map(department => ({
            name: department.dep_name,
            value: department.id
        }))
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: "What is the name of the role you would like to add?"
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the salary for this role?"
            },
            {
                type: 'list',
                name: 'department_id',
                message: "What department does this role belong to?",
                choices: deptList
            }
        ])
            .then(role => {
                const mysql = `INSERT INTO roles SET ?;`;
                db.query(mysql, role, (error, reponse) => {
                    if (error) throw error;
                    console.log("\n", `New role has been added!`, "\n");
                });
                userPrompt();
            });
    });
};

// Add a department to the department table
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