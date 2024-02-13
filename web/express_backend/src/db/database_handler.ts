import { Dialect, Sequelize, ConnectionRefusedError } from 'sequelize'
import { DEFAULT_DB_HOST, DEFAULT_DB_PORT, DEFAULT_DB_DRIVER, DEFAULT_DB_USER, DEFAULT_DB_PASS, DEFAULT_DB_NAME } from '../config/globals'

type ConnectionInfo = {
    db_host: string
    db_port: string
    db_driver: Dialect
    db_user: string
    db_password: string
    db_name: string
}

export class DatabaseHandler {

    private static instance: DatabaseHandler | undefined;
    private connection: Sequelize;

    private constructor() {
        let conn_info: ConnectionInfo = DatabaseHandler.getConnectionInfo();
        this.connection = new Sequelize(
            conn_info.db_name,
            conn_info.db_user,
            conn_info.db_password,
            {
                host: conn_info.db_host,
                port: parseInt(conn_info.db_port),
                dialect: conn_info.db_driver,
                logging: false
            }
        );
    }

    public async ok(): Promise<boolean> {
        try {
            await this.connection.authenticate();
            console.log('Connection to the database has been established successfully.');
            return true;
        } catch (error) {
            if (error instanceof ConnectionRefusedError) {
                console.error('Unable to connect to the database due to:', error.message);
            } else {
                console.error('Unable to connect to the database to unkown error');
            }
            return false;
        }
    }

    public getConnection(): Sequelize {
        return this.connection;
    }

    public static getInstance(): DatabaseHandler {
        if (DatabaseHandler.instance != undefined) {
            return DatabaseHandler.instance;
        }
        DatabaseHandler.instance = new DatabaseHandler();
        return DatabaseHandler.instance;
    }

    private static getConnectionInfo(): ConnectionInfo {
        let db_host: string = process.env.DB_HOST || DEFAULT_DB_HOST;
        let db_port: string = process.env.DB_PORT || DEFAULT_DB_PORT;
        let db_driver: Dialect = process.env.DB_DRIVER as Dialect || DEFAULT_DB_DRIVER as Dialect;
        let db_user: string = process.env.DB_USER || DEFAULT_DB_USER;
        let db_password: string = process.env.DB_PASS || DEFAULT_DB_PASS;
        let db_name: string = process.env.DB_NAME || DEFAULT_DB_NAME;
        return { db_host, db_port, db_driver, db_user, db_password, db_name };
    }
}