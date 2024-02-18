import { Sequelize } from "sequelize-typescript";
import { Dialect, ConnectionRefusedError } from "sequelize";
import { CONFIG_DEFAULTS } from "../config/config_defaults";
import chalk from "chalk";

type ConnectionInfo = {
  db_host: string;
  db_port: string;
  db_driver: Dialect;
  db_user: string;
  db_password: string;
  db_name: string;
};

export class DatabaseHandler {
  private static instance: DatabaseHandler | undefined;
  private connection: Sequelize;

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
