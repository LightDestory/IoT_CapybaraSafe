-- Database Creation
CREATE DATABASE IF NOT EXISTS iot_project;

-- Database Usage
USE iot_project;

-- Workers Table Creation
CREATE TABLE IF NOT EXISTS Workers (
    id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    profession VARCHAR(50)
);

-- Activities Table Creation
CREATE TABLE IF NOT EXISTS Activities (
    ID INT PRIMARY KEY,
    description VARCHAR(255),
    duration INT CHECK (duration >= 0 AND duration <= 120),
    date DATE,
    status VARCHAR(50) CHECK (status IN ('in progress', 'to be completed', 'scheduled', 'completed'))
);

-- Assignment Table Creation
CREATE TABLE IF NOT EXISTS Assignment (
    ID INT PRIMARY KEY,
    worker_id INT,
    activity_id INT,
    start_assignment DATETIME,
    FOREIGN KEY (worker_id) REFERENCES Workers(id),
    FOREIGN KEY (activity_id) REFERENCES Activities(ID)
);

-- Tracking Device Table Creation
CREATE TABLE IF NOT EXISTS Tracking_Device (
    ID INT PRIMARY KEY,
    MacAddress VARCHAR(17), -- Assumes that the MAC address is represented in standard format (e.g., "00:1A:2B:3C:4D:5E")
    last_maintenance DATE,
    firmware_version VARCHAR(50)
);

-- Anchors Table Creation
CREATE TABLE IF NOT EXISTS Anchors (
    ID INT PRIMARY KEY,
    distance INT,
    MacAddress VARCHAR(17), 
    status BOOLEAN
);

-- Alerts Table Creation
CREATE TABLE IF NOT EXISTS Alerts (
    ID INT PRIMARY KEY,
    description VARCHAR(255),
    activity_id INT,
    is_broadcast BOOLEAN,
    FOREIGN KEY (activity_id) REFERENCES Activities(ID)
);

-- Remote Tracking Table Creation
CREATE TABLE IF NOT EXISTS Remote_Tracking (
    ID INT PRIMARY KEY,
    timestamp TIMESTAMP,
    anchor_id INT,
    worker_id INT,
    device_id INT,
    sick BOOLEAN,
    activity_id INT,
    FOREIGN KEY (anchor_id) REFERENCES Anchors(ID),
    FOREIGN KEY (worker_id) REFERENCES Workers(id),
    FOREIGN KEY (device_id) REFERENCES Tracking_Device(ID),
    FOREIGN KEY (activity_id) REFERENCES Activities(ID)
);