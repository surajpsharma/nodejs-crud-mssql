const sql = require("mssql");
require("dotenv").config();

const useMemoryStore =
  (process.env.DATA_BACKEND || "").toLowerCase() === "memory";

const dbConfig = useMemoryStore
  ? null
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      options: {
        encrypt: process.env.DB_ENCRYPT === "true",
        trustServerCertificate:
          process.env.DB_TRUST_CERTIFICATE === "true" ||
          process.env.DB_ENCRYPT !== "true",
      },
      pool: {
        max: parseInt(process.env.DB_POOL_MAX || "10", 10),
        min: parseInt(process.env.DB_POOL_MIN || "0", 10),
        idleTimeoutMillis: parseInt(
          process.env.DB_POOL_IDLE_TIMEOUT || "30000",
          10
        ),
      },
    };

if (dbConfig && process.env.DB_PORT) {
  dbConfig.port = parseInt(process.env.DB_PORT, 10);
}

let connectionPool;

const connectDB = async () => {
  if (useMemoryStore) {
    return null;
  }

  if (connectionPool) {
    return connectionPool;
  }

  try {
    connectionPool = await sql.connect(dbConfig);
    return connectionPool;
  } catch (error) {
    connectionPool = null;
    console.error("Database connection failed:", error.message);
    throw error;
  }
};

module.exports = { sql, connectDB, useMemoryStore, dbConfig };
