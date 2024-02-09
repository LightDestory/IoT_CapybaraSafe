-- Database Creation
CREATE DATABASE IF NOT EXISTS iot_project;

-- Database Usage
USE iot_project;

-- Workers Table Creation
CREATE TABLE IF NOT EXISTS Workers (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    profession VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

-- Activities Table Creation
CREATE TABLE IF NOT EXISTS Activities (
    id INT AUTO_INCREMENT NOT NULL,
    text_description VARCHAR(255) NOT NULL,
    duration_minute INT CHECK (
        duration > 0
        AND duration <= 120
    ) NOT NULL,
    scheduled_date DATETIME NOT NULL,
    status VARCHAR(50) CHECK (
        status IN (
            'in progress',
            'to be completed',
            'scheduled',
            'completed'
        )
    ) NOT NULL,
    PRIMARY KEY (id)
);

-- Assignments Table Creation
CREATE TABLE IF NOT EXISTS Assignments (
    id INT AUTO_INCREMENT NOT NULL,
    worker_id INT NOT NULL,
    activity_id INT NOT NULL,
    start_time DATETIME DEFAULT NULL,
    FOREIGN KEY (worker_id) REFERENCES Workers(id),
    FOREIGN KEY (activity_id) REFERENCES Activities(id),
    PRIMARY KEY (id)
);

-- TrackingDevices Table Creation
CREATE TABLE IF NOT EXISTS TrackingDevices (
    id INT AUTO_INCREMENT NOT NULL,
    mac_address VARCHAR(17),
    -- Assumes that the MAC address is represented in standard format (e.g., "00:1A:2B:3C:4D:5E")
    last_maintenance DATE,
    firmware_version VARCHAR(50),
    PRIMARY KEY (id)
);

-- Anchors Table Creation
CREATE TABLE IF NOT EXISTS Anchors (
    id INT AUTO_INCREMENT NOT NULL,
    mac_address VARCHAR(17) NOT NULL,
    status VARCHAR(255) DEFAULT "working",
    PRIMARY KEY (id)
);

-- Alerts Table Creation
CREATE TABLE IF NOT EXISTS Alerts (
    id INT AUTO_INCREMENT NOT NULL,
    text_description VARCHAR(255),
    activity_id INT,
    is_broadcast BOOLEAN DEFAULT 0,
    FOREIGN KEY (activity_id) REFERENCES Activities(id),
    PRIMARY KEY(id)
);

-- RemoteTrackings Table Creation
CREATE TABLE IF NOT EXISTS RemoteTrackings (
    id INT AUTO_INCREMENT NOT NULL,
    timestamp datetime NOT NULL,
    anchor_id INT NOT NULL,
    worker_id INT NOT NULL,
    device_id INT NOT NULL,
    activity_id INT NOT NULL,
    emergency BOOLEAN DEFAULT 0,
    FOREIGN KEY (anchor_id) REFERENCES Anchors(id),
    FOREIGN KEY (worker_id) REFERENCES Workers(id),
    FOREIGN KEY (device_id) REFERENCES TrackingDevices(id),
    FOREIGN KEY (activity_id) REFERENCES Activities(id)
);

CREATE VIEW ActiveWorkers AS
SELECT 
FROM Workers W, Activities Ac, Assignments A, RemoteTrackings RT
WHERE ;