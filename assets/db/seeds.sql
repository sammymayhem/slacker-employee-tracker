INSERT INTO department (dep_name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 40000, 4),
       ("Salesperson", 35000, 4),
       ("Lead Engineer", 70000, 1),
       ("Software Engineer", 60000, 1),
       ("Account Manager", 60000, 2),
       ("Accountant", 55000, 2),
       ("Legal Team Lead", 80000, 3),
       ("Lawyer", 75000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sam", "Wallace", 1, 2),
       ("Jess", "Harris", 2, 2);
