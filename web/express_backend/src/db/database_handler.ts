import { Sequelize } from "sequelize-typescript";
import { Dialect, ConnectionRefusedError } from "sequelize";
import { CONFIG_DEFAULTS } from "../config/config_defaults";
import chalk from "chalk";

/**
 * ConnectionInfo type
 * @property {string} db_host - The database host
 * @property {string} db_port - The database port
 * @property {Dialect} db_driver - The database driver
 * @property {string} db_user - The database user
 * @property {string} db_password - The database password
 * @property {string} db_name - The database name
 */
interface ConnectionInfo {
  db_host: string;
  db_port: string;
  db_driver: Dialect;
  db_user: string;
  db_password: string;
  db_name: string;
}

/**
 * @description This class is a singleton that handles the connection to the database
 */
export class DatabaseHandler {
  // Singleton instance
  private static instance: DatabaseHandler | undefined;
  // Sequelize connection
  private readonly connection: Sequelize;

  /**
   * @description This constructor is private to avoid multiple instances of the class
   */
  private constructor() {
    const conn_info: ConnectionInfo = DatabaseHandler.getConnectionInfo();
    this.connection = new Sequelize({
      database: conn_info.db_name,
      username: conn_info.db_user,
      password: conn_info.db_password,
      host: conn_info.db_host,
      port: parseInt(conn_info.db_port),
      dialect: conn_info.db_driver,
      logging: false,
      models: [__dirname + "/models"]
    });
  }

  /**
   * @description This method checks if the connection to the database is ok and synchronizes the models
   * @returns {Promise<boolean>} - A promise that resolves to true if the connection is ok, false otherwise
   */
  public async ok(): Promise<boolean> {
    try {
      await this.connection.authenticate();
      console.log(
        chalk.green(
          "Connection to the database has been established successfully."
        )
      );
      console.log(chalk.blue("Synchronizing models..."));
      await this.connection.sync({ alter: false, force: false });
      console.log(chalk.green("All models were synchronized successfully."));
      return true;
    } catch (error) {
      let error_message: string = "";
      if (error instanceof ConnectionRefusedError) {
        error_message = `Unable to connect to the database due to: ${error.message}`;
      } else {
        error_message = "Unable to connect to the database to unkown error";
        console.log(error);
      }
      console.error(chalk.red(error_message));
      return false;
    }
  }

  /**
   * @description This method returns the connection to the database as a Sequelize object
   * @returns {Sequelize} - The connection to the database
   */
  public getConnection(): Sequelize {
    return this.connection;
  }

  /**
   * @description This method returns the singleton instance of the class, creates it if it doesn't exist
   * @returns {DatabaseHandler} - The singleton instance of the class
   */
  public static getInstance(): DatabaseHandler {
    if (DatabaseHandler.instance != undefined) {
      return DatabaseHandler.instance;
    }
    DatabaseHandler.instance = new DatabaseHandler();
    return DatabaseHandler.instance;
  }

  /**
   * @description This method retrieves the connection info from the environment variables or the default values
   * @returns {ConnectionInfo} - The connection info
   */
  private static getConnectionInfo(): ConnectionInfo {
    const db_host: string =
      process.env.DB_HOST || CONFIG_DEFAULTS.DEFAULT_DB_HOST;
    const db_port: string =
      process.env.DB_PORT || CONFIG_DEFAULTS.DEFAULT_DB_PORT;
    const db_driver: Dialect =
      (process.env.DB_DRIVER as Dialect) ||
      (CONFIG_DEFAULTS.DEFAULT_DB_DRIVER as Dialect);
    const db_user: string =
      process.env.DB_USER || CONFIG_DEFAULTS.DEFAULT_DB_USER;
    const db_password: string =
      process.env.DB_PASS || CONFIG_DEFAULTS.DEFAULT_DB_PASS;
    const db_name: string =
      process.env.DB_NAME || CONFIG_DEFAULTS.DEFAULT_DB_NAME;
    return { db_host, db_port, db_driver, db_user, db_password, db_name };
  }
}
