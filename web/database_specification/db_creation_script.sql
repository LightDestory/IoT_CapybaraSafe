-- Database Creation
CREATE DATABASE IF NOT EXISTS iotproject;

-- Database Usage
USE iotproject;

-- Workers Table Creation
CREATE TABLE IF NOT EXISTS Workers
(
    id         INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(50)        NOT NULL,
    last_name  VARCHAR(50)        NOT NULL,
    profession VARCHAR(50)        NOT NULL,
    PRIMARY KEY (id)
);

-- Activities Table Creation
CREATE TABLE IF NOT EXISTS Activities
(
    id               INT AUTO_INCREMENT NOT NULL,
    text_description VARCHAR(255)       NOT NULL,
    duration_minute  INT                NOT NULL CHECK (
        duration_minute > 0
            AND duration_minute <= 120
        ),
    scheduled_date   DATETIME           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status           VARCHAR(50)        NOT NULL CHECK (
        status IN (
                   'in progress',
                   'to be completed',
                   'scheduled',
                   'completed'
            )
        ),
    PRIMARY KEY (id)
);

-- Assignments Table Creation
CREATE TABLE IF NOT EXISTS Assignments
(
    worker_id   INT NOT NULL,
    activity_id INT NOT NULL,
    FOREIGN KEY (worker_id) REFERENCES Workers (id),
    FOREIGN KEY (activity_id) REFERENCES Activities (id),
    PRIMARY KEY (worker_id, activity_id)
);

-- TrackingDevices Table Creation
CREATE TABLE IF NOT EXISTS TrackingDevices
(
    id               INT AUTO_INCREMENT NOT NULL,
    mac_address      VARCHAR(17)        NOT NULL,
    -- Assumes that the MAC address is represented in standard format (e.g., "00:1A:2B:3C:4D:5E")
    last_maintenance DATE               NOT NULL,
    firmware_version VARCHAR(50)        NOT NULL,
    PRIMARY KEY (id)
);

-- Anchors Table Creation
CREATE TABLE IF NOT EXISTS Anchors
(
    id          INT AUTO_INCREMENT NOT NULL,
    mac_address VARCHAR(17)        NOT NULL,
    status      VARCHAR(255)       NOT NULL DEFAULT 'working',
    PRIMARY KEY (id)
);

-- Alerts Table Creation
CREATE TABLE IF NOT EXISTS Alerts
(
    id               INT AUTO_INCREMENT NOT NULL,
    text_description VARCHAR(255)       NOT NULL,
    activity_id      INT,
    is_broadcast     BOOLEAN            NOT NULL DEFAULT 0,
    send_date        DATETIME           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES Activities (id),
    PRIMARY KEY (id)
);

-- RemoteTrackings Table Creation
CREATE TABLE IF NOT EXISTS RemoteTrackings
(
    timestamp   datetime NOT NULL,
    anchor_id   INT      NOT NULL,
    anchor_signal_strength INT NOT NULL,
    worker_id   INT      NOT NULL,
    device_id   INT      NOT NULL,
    activity_id INT      NOT NULL,
    emergency   BOOLEAN DEFAULT 0,
    heart_rate  INT NOT NULL,
    saturation  INT NOT NULL,
    temperature INT NOT NULL,
    FOREIGN KEY (anchor_id) REFERENCES Anchors (id),
    FOREIGN KEY (worker_id) REFERENCES Workers (id),
    FOREIGN KEY (device_id) REFERENCES TrackingDevices (id),
    FOREIGN KEY (activity_id) REFERENCES Activities (id),
    PRIMARY KEY (worker_id, device_id, activity_id)
);

-- CREATE OR REPLACE VIEW ActiveWorkers AS
-- SELECT DISTINCT W.first_name      as "worker_first_name",
--                 W.last_name       as "worker_last_name",
--                 W.id              as "worker_id",
--                 Ac.id             as "activity_id",
--                 Ac.scheduled_date as "started_on",
--                 RT.device_id      as "device_id",
--                 RT.anchor_id      as "last_location_anchor"
-- FROM Workers W,
--      Activities Ac,
--      Assignments A,
--      RemoteTrackings RT
-- WHERE Ac.status = "in progress"
--   and A.worker_id = W.id
--   and A.activity_id = Ac.id
--   and RT.worker_id = W.id
--   and RT.activity_id = Ac.id
-- ORDER BY timestamp DESC;
--
-- CREATE OR REPLACE VIEW ActiveDevices AS
-- SELECT DISTINCT device_id
-- FROM ActiveWorkers;
--
-- CREATE OR REPLACE VIEW AvailableDevices AS
-- SELECT *
-- FROM TrackingDevices as TD
-- WHERE TD.id NOT IN (SELECT AD.device_id FROM ActiveDevices as AD);