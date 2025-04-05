import jwt from 'jsonwebtoken';

import { pool } from '#src/models/db.js';
import config from '#src/config.js';

export async function createAuthUser(data) {
  try {
    const { email, username, password, emailVerificationToken } = data;
    const query = `
      INSERT INTO users (email, username, password, emailVerificationToken)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [email, username, password, emailVerificationToken];
    const result = await pool.query(query, values);

    const user = { ...result.rows[0], password: null };
    return user;
  } catch (error) {
    throw new Error(`Database createAuthUser error: ${error}`);
  }
}

export async function getUserByUsernameOrEmail(username, email) {
  try {
    const query = `
      SELECT * FROM users
      WHERE username = $1 OR email = $2
    `;
    const values = [username, email];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return user;
  } catch (error) {
    throw new Error(`Database getUserByUsernameOrEmail error: ${error}`);
  }
}

export async function getUserByEmail(email) {
  try {
    const query = `
      SELECT * FROM users
      WHERE email = $1
    `;
    const values = [email];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return user;
  } catch (error) {
    throw new Error(`Database getUserByEmail error: ${error}`);
  }
}

export async function getUserByVerificationToken(token) {
  try {
    const query = `
      SELECT * FROM users
      WHERE emailVerificationToken = $1
    `;
    const values = [token];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return user;
  } catch (error) {
    throw new Error(`Database getUserByVerificationToken error: ${error}`);
  }
}

export async function updateRoleAndVerifyEmailField(id, role, token) {
  try {
    const query = `
      UPDATE users
      SET role = $1, emailVerificationToken = $2
      WHERE id = $3
      RETURNING *
    `;
    const values = [role, token, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return user;
  } catch (error) {
    throw new Error(`Database updateVerifyEmailField error: ${error}`);
  }
}

export function signToken(id, email, username, role) {
  return jwt.sign(
    {
      id,
      email,
      username,
      role,
    },
    config.JWT_TOKEN,
  );
}
