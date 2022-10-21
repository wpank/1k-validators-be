import mongoose from "mongoose";

import logger from "../logger";

import * as queries from "./queries";

// [name, client, version, null, networkId]
export type NodeDetails = [string, string, string, string, string, string];

export * from "./queries";

export class Db {
  static async create(uri = "mongodb://localhost:27017/otv"): Promise<Db> {
    await mongoose.connect(uri, {});

    return new Promise((resolve, reject) => {
      mongoose.connection.once("open", async () => {
        logger.info(`Established a connection to MongoDB.`);
        const db = new Db();
        // Initialize lastNominatedEraIndex if it's not already set.
        if (!(await queries.getLastNominatedEraIndex())) {
          await queries.setLastNominatedEraIndex(0);
        }
        resolve(db);
      });

      mongoose.connection.on("error", (err) => {
        logger.error(`MongoDB connection issue: ${err}`);
        reject(err);
      });
    });
  }
}
