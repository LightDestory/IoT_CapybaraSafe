-- Inserting data into Workers table
INSERT INTO
    `Workers`
VALUES
    (1, 'Alessio', 'Tudisco', 'CapybaraKing'),
    (2, 'Miriana', 'Russo', 'Informatica'),
    (3, 'Giovanni', "Urso", 'Schiavo');

-- Inserting data into TrackingDevices table
INSERT INTO
    `TrackingDevices`
VALUES
    (1, '49:31:31:27:23:64', '2023-10-13', 'v2.0'),
    (2, '58:11:19:76:12:03', '2023-11-10', 'v1.5'),
    (3, '68:42:16:50:20:78', '2023-11-16', 'v2.0'),
    (4, '78:22:21:53:11:78', '2023-11-12', 'v2.0');

-- Inserting data into Anchors table
INSERT INTO
    `Anchors`
VALUES
    (1, '53:59:79:48:46:35', 'working'),
    (2, '11:75:27:04:51:97', 'working'),
    (3, '87:11:44:93:17:40', 'working'),
    (4, '15:55:05:64:17:67', 'working'),
    (5, '16:34:74:16:43:43', 'anomaly');

-- Inserting data into Activities table
INSERT INTO
    `Activities`
VALUES
    (
        1,
        'Riparazione perdita tubo secondario',
        95,
        '2024-01-30 18:30:00',
        'completed'
    ),
    (
        2,
        'Suddivisione ambiente zona caldaie',
        65,
        '2024-02-05 12:00:00',
        'to be completed'
    ),
    (
        3,
        'Purificazione bacino da scorie radioattive',
        116,
        '2024-02-14 00:30:00',
        'completed'
    ),
    (
        4,
        'Caccia ai megalodonti',
        21,
        '2024-02-13 21:00:00',
        'in progress'
    ),
    (
        5,
        'Sostituzione motore pompa L8',
        47,
        '2024-03-15 08:30:00',
        'scheduled'
    );

-- Inserting data into Alerts table
INSERT INTO
    `Alerts` (id, text_description, activity_id, is_broadcast)
VALUES
    (1, 'La diga si è rotta!', NULL, 1),
    (2, 'Uno squalo mi ha mangiato il panino!', 2, 0),
    (3, 'State attenti alle scorie!', 3, 0),
    (4, 'Prova prova, mi ricevete?', 4, 0),
    (5, 'Tu parlare americano?', 1, 0),
    (
        6,
        'La polizia è qui, nascondete la farina!',
        NULL,
        4
    ),
    (
        7,
        'Perché un pastore tedesco non parla il tedesco?',
        3,
        0
    );

-- Inserting data into Assignments table
INSERT INTO
    `Assignments`
VALUES
    (1, 1),
    (2, 1),
    (2, 2),
    (1, 3),
    (1, 4),
    (2, 4),
    (3, 1),
    (3, 4);

-- Inserting data into RemoteTrackings table
INSERT INTO
    `RemoteTrackings`
VALUES
    (
        '2024-01-30 18:45:00',  -- timestamp
        2, -- communication_progressive
        2, -- anchor_id
        -34, -- rssi
        1, -- worker_id
        1, -- device_id
        1, -- activity_id
        0, -- emergency
        78, -- heart_rate
        2, -- saturation
        3 -- temperature
    ),
    (
        '2024-01-30 18:35:00',  -- timestamp
        2, -- communication_progressive
        1, -- anchor_id
        -44, -- rssi
        2, -- worker_id
        2, -- device_id
        1, -- activity_id
        1, -- emergency
        78, -- heart_rate
        2, -- saturation
        3 -- temperature
    ),
    (
        '2024-01-30 18:35:00',  -- timestamp
        1, -- communication_progressive
        1, -- anchor_id
        -44, -- rssi
        3, -- worker_id
        3, -- device_id
        1, -- activity_id
        0, -- emergency
        78, -- heart_rate
        2, -- saturation
        3 -- temperature
    ),
    (
        '2024-01-30 18:35:00',  -- timestamp
        1, -- communication_progressive
        1, -- anchor_id
        -44, -- rssi
        2, -- worker_id
        1, -- device_id
        2, -- activity_id
        0, -- emergency
        78, -- heart_rate
        2, -- saturation
        3 -- temperature
    ),
    (
        '2024-01-30 18:35:00',  -- timestamp
        2, -- communication_progressive
        2, -- anchor_id
        -44, -- rssi
        1, -- worker_id
        2, -- device_id
        3, -- activity_id
        0, -- emergency
        78, -- heart_rate
        2, -- saturation
        3 -- temperature
    ),
    (
        '2024-01-30 18:35:00',  -- timestamp
        2, -- communication_progressive
        1, -- anchor_id
        -44, -- rssi
        1, -- worker_id
        2, -- device_id
        4, -- activity_id
        1, -- emergency
        78, -- heart_rate
        2, -- saturation
        3 -- temperature
    ),
    (
        '2024-01-30 18:35:00',  -- timestamp
        1, -- communication_progressive
        1, -- anchor_id
        -44, -- rssi
        2, -- worker_id
        1, -- device_id
        4, -- activity_id
        0, -- emergency
        78, -- heart_rate
        2, -- saturation
        3 -- temperature
    ),
    (
        '2024-01-30 18:35:00',  -- timestamp
        2, -- communication_progressive
        2, -- anchor_id
        -44, -- rssi
        3, -- worker_id
        3, -- device_id
        4, -- activity_id
        0, -- emergency
        78, -- heart_rate
        2, -- saturation
        3 -- temperature
    );
    