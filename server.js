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
                case "View all emplyees":
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
                    quitDb();
                    break;
                default:
                    userPrompt();
            }
        });

}
userPrompt();

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);