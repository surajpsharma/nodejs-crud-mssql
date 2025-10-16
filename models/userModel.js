const { sql, connectDB, useMemoryStore } = require("../config/db");

let memoryUsers = [];
let nextMemoryId = 1;

const toIsoString = (date) => date.toISOString();

const createUsersTable = async () => {
  if (useMemoryStore) {
    return;
  }

  const pool = await connectDB();
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
    CREATE TABLE Users (
      id INT IDENTITY(1,1) PRIMARY KEY,
      name NVARCHAR(100) NOT NULL,
      email NVARCHAR(100) NOT NULL UNIQUE,
      created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    )
  `);
};

//memory store functions
const createUser = async ({ name, email }) => {
  if (useMemoryStore) {
    const newUser = {
      id: nextMemoryId++,
      name,
      email,
      created_at: toIsoString(new Date()),
    };
    memoryUsers.push(newUser);
    return newUser;
  }

  const pool = await connectDB();
  const result = await pool
    .request()
    .input("name", sql.NVarChar(100), name)
    .input("email", sql.NVarChar(100), email).query(`
      INSERT INTO Users (name, email)
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.created_at
      VALUES (@name, @email)
    `);

  return result.recordset[0];
};

const getAllUsers = async () => {
  if (useMemoryStore) {
    return [...memoryUsers];
  }

  const pool = await connectDB();
  const result = await pool
    .request()
    .query(`SELECT id, name, email, created_at FROM Users ORDER BY id`);
  return result.recordset;
};

const getUserById = async (id) => {
  if (useMemoryStore) {
    return memoryUsers.find((user) => user.id === Number(id)) || null;
  }

  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`SELECT id, name, email, created_at FROM Users WHERE id = @id`);

  return result.recordset[0] || null;
};

const updateUser = async (id, { name, email }) => {
  if (useMemoryStore) {
    const numericId = Number(id);
    const index = memoryUsers.findIndex((user) => user.id === numericId);
    if (index === -1) {
      return null;
    }

    memoryUsers[index] = {
      ...memoryUsers[index],
      name,
      email,
    };

    return memoryUsers[index];
  }

  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("name", sql.NVarChar(100), name)
    .input("email", sql.NVarChar(100), email).query(`
      UPDATE Users
      SET name = @name, email = @email
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.created_at
      WHERE id = @id
    `);

  return result.recordset[0] || null;
};

const getUserByEmail = async (email) => {
  if (useMemoryStore) {
    return (
      memoryUsers.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      ) || null
    );
  }

  const pool = await connectDB();
  const result = await pool.request().input("email", sql.NVarChar(100), email)
    .query(`
      SELECT id, name, email, created_at
      FROM Users
      WHERE email = @email
    `);

  return result.recordset[0] || null;
};

const deleteUser = async (id) => {
  if (useMemoryStore) {
    const numericId = Number(id);
    const index = memoryUsers.findIndex((user) => user.id === numericId);
    if (index === -1) {
      return null;
    }

    const [removed] = memoryUsers.splice(index, 1);
    return removed;
  }

  const pool = await connectDB();
  const result = await pool.request().input("id", sql.Int, id).query(`
      DELETE FROM Users
      OUTPUT DELETED.id, DELETED.name, DELETED.email, DELETED.created_at
      WHERE id = @id
    `);

  return result.recordset[0] || null;
};

module.exports = {
  createUsersTable,
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
