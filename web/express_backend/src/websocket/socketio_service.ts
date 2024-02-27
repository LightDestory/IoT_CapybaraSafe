import chalk from "chalk";
import { Server } from "socket.io";
import { Server as HTTP_SERVER } from "http";

/**
 * @description This class is a singleton that handles the communication with the websockets
 */
export class SocketIO_Service {
  private static instance: Server | undefined;
  private isInitialized: boolean = false;

  /**
   * @description This constructor is private to avoid multiple instances of the class. It initializes the SocketIO Server.
   */
  private constructor(httpServer: HTTP_SERVER) {
    // Socket.io Server
    SocketIO_Service.instance = new Server(httpServer, {
      cors: {
        origin: "*"
      }
    });
  }

  /**
   * @description This method returns the singleton instance of the class
   */
  public static getInstance(): Server {
    return SocketIO_Service.instance!;
  }

  public static initSocketIO(httpClient: HTTP_SERVER): void {
    new SocketIO_Service(httpClient);
  }
}
