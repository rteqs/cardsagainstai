const pool = require('./pool');

const createUserTable = async () => {
  const createTableQuery = `CREATE TABLE IF NOT EXISTS users
  (id SERIAL PRIMARY KEY, 
  username VARCHAR(100) NOT NULL,
  )`;

  try {
    const res = await pool.query(createTableQuery);
    console.log(res);
  } catch (ex) {
    console.error(ex);
  } finally {
    pool.end();
  }
};

const queryUserByEmail = async (email) => {
  const queryText = 'SELECT * FROM users WHERE email=$1';
  const { rows } = await pool.query(queryText, [email]);
  return rows[0];
};

const queryUserById = async (id) => {
  const queryText = 'SELECT * FROM users WHERE id=$1';
  const { rows } = await pool.query(queryText, [id]);
  return rows[0];
};

module.exports = {
  createUserTable,
  queryUserByEmail,
  queryUserById,
};
