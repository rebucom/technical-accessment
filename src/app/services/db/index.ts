import * as mysql from "mysql2/promise";
import queries from "./queries";
import { CONFIG } from "../../../config";
import { Pool, PoolConnection } from "mysql2/promise";
import { DatabaseTransaction } from "../../../types";
const { DATABASE, URL } = CONFIG;

// export class DatabaseConnection {
//   private connection: mysql.Connection;

//   constructor() {}

//    async connect() {
//     logger.info("Initializing Database");

//     try {
//       // const connection = await mysql.createConnection(URL);
//       this.connection = await mysql.createConnection(URL);

//       await this.connection.query(`USE ${DATABASE}`);

//       logger.info("Database connected successfully");
//       return this.connection;
//       // return new DatabaseConnection(connection);
//     } catch (error) {
//       logger.error("Failed to connect to the database:", error);
//       throw error;
//     }
//   }

//   async setupDB(): Promise<void> {
//     try {
//       logger.info("Setting Up Database");
//       logger.info("Running createDB query...");

//       await this.connection.beginTransaction();

//       await this.connection.query(queries.createDB(DATABASE));

//       await this.connection.query(`USE ${DATABASE}`);

//       logger.info("Running createInventory query...");
//       await this.connection.query(queries.createInventory);

//       await this.connection.commit();
//     } catch (err) {
//       await this.connection.rollback();
//       logger.error("Error Running Scripts:", err);
//     }
//   }

//   async execute(query: string, params: any[]): Promise<void> {
//     await this.connection.execute(query, params);
//   }

//   async disconnect(): Promise<void> {
//     await this.connection.end();
//     logger.info("Database connection closed");
//   }
// }

export class DatabaseConnection {
  private pool!: Pool;
  private database: string;

  constructor(database: string) {
    this.database = database;
  }

  async connect() {
    logger.info("Initializing Database Pool");

    try {
      this.pool = mysql.createPool({
        uri: URL,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      const connection = await this.pool.getConnection();
      await connection.query(`USE ${this.database}`);

      connection.release();

      logger.info("Database pool connected successfully");
    } catch (error) {
      logger.error("Failed to connect to the database:", error);
      throw error;
    }
  }

  async setupDB(): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      logger.info("Setting Up Database");

      await connection.beginTransaction();

      logger.info("Running createDB query...");
      await connection.query(queries.createDB(this.database));

      await connection.query(`USE ${this.database}`);

      logger.info("Running createInventory query...");
      await connection.query(queries.createInventory);

      await connection.commit();
      logger.info("Database setup completed successfully");
    } catch (err) {
      await connection.rollback();
      logger.error("Error Running Scripts:", err);
      throw err;
    } finally {
      connection.release();
    }
  }

  async getTransaction(): Promise<DatabaseTransaction> {
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();

    return {
      async commit() {
        await connection.commit();
      },
      async rollback() {
        await connection.rollback();
      },
      async execute(query: string, params: any[]) {
        return await connection.execute(query, params);
      },
      release() {
        connection.release();
      },
    };
  }

  async execute(query: string, params: any[]): Promise<any> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute(query, params);
      return result;
    } finally {
      connection.release();
    }
  }

  async executeTransaction<T>(
    callback: (transaction: DatabaseTransaction) => Promise<T>,
  ): Promise<T> {
    const transaction = await this.getTransaction();
    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    } finally {
      transaction.release();
    }
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
    logger.info("Database pool closed");
  }

  async getConnection(): Promise<PoolConnection> {
    return await this.pool.getConnection();
  }
}
