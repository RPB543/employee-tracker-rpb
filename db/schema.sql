DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name varchar(30) NOT NULL 
);

CREATE TABLE role ( 
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title varchar(30) NOT NULL,
    department_id INT NOT NULL, 
    salary DECIMAL NOT NULL 
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    first_name varchar(30) NOT NULL, 
    last_name varchar(30) NOT NULL, 
    role_id INT NOT NULL,
    manager_id INT 
);