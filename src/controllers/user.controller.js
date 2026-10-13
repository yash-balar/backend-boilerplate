import pool from "../config/mysql.js";

// export const getUserController = async (req, res) => {
//   const limit = Number(req.query.limit) || 10;
//   const cursor = req.query.cursor;
//   const search = req.query.search || "balar";

//   let query = `SELECT u.id, u.name, u.email, u.age, t.status from users u INNER JOIN user_task t ON u.id = t.user_id WHERE 1=1 AND status IN ('success', 'completed')`;
//   let params = [];

//   if (cursor) {
//     query += " AND id > ?";
//     params.push(cursor);
//   }

//   // if (search) {
//   //   query += " AND name LIKE ?";
//   //   params.push(`%${search}%`);
//   // }

//   query += " ORDER BY id LIMIT ?";
//   params.push(limit + 1);

//   console.log("query::::", query, params);

//   console.log(query, params);
//   const [rows] = await pool.execute(query, params);
//   console.log("rows::::::::::::", rows);

//   const hasNextPage = rows.length > limit;

//   const result = hasNextPage ? rows.slice(0, limit) : rows;

//   const nextCursor = hasNextPage ? result[result.length - 1].id : null;

//   return res.status(200).json({
//     message: "Users get successfully",
//     data: result,
//     pagination: { hasNextPage, nextCursor },
//   });
// };

export const getUserController = async (req, res) => {
  const connection = pool.getConnection();

  // try {
  (await connection).beginTransaction();

  const [ordersRows] = (await connection).execute(
    `SELECT id, user_id, status, total_amount
     FROM orders
     WHERE id = ?
     FOR UPDATE`,
    [1],
  );

  if (!ordersRows.length > 0) {
    throw new Error("order not found");
  }

  const [productsRows] = (await connection).execute(
    `SELECT id, stock
     FROM orders
     WHERE id = ?
     FOR UPDATE`,
    [1],
  );

  if (!productsRows.length > 0) {
    throw new Error("products not found");
  }

  if (productsRows[0].stock <= 0) {
    throw new Error("products is out of stock");
  }

  (await connection).execute(
    `UPDATE products SET stock = stock - ? WHERE id = ? AND stock > 0`,
    [1, 1],
  );

  const [result] = (await connection).execute(
    `UPDATE orders SET status = 'completed' WHERE id = ? AND status = 'pending'`,
    [2],
  );

  (await connection).commit();

  console.log("result::::::", result);

  res.status(200).json({ message: "Data get successfully", data: result });
  // } catch (error) {
  //   (await connection).rollback();
  //   console.log(":::::::::::::::error>>::::", error);
  // }
};

// export const getUserController = async (req, res) => {
//   const connection = await pool.getConnection();

//   try {
//     await connection.beginTransaction();
//     const [sender] = await connection.execute(
//       `SELECT amount from orders WHERE id = ?`,
//       [1],
//     );
//     console.log("sender:::::::::", sender);

//     if (sender.length === 0) {
//       throw new Error("Sender not found");
//     }

//     if (sender[0].balance < 500) {
//       throw new Error("Insufficient balance");
//     }

//     await connection.execute(
//       `UPDATE orders SET amount = amount - ? WHERE id = ?`,
//       [200, 1],
//     );

//     await connection.execute(
//       `UPDATE orders SET amount = amount + ? WHERE id = ?`,
//       [200, 1],
//     );

//     connection.commit();
//   } catch (error) {}
// };

export const addUserController = async (req, res) => {
  const { name, email, age } = req.body;

  const [rows] = await pool.execute(
    "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), age INT)",
    [],
  );

  const [rows2] = await pool.execute(
    "INSERT INTO users (name, email, age) VALUES(?, ?, ?)",
    [name, email, age],
  );

  console.log(rows2);

  const result = await pool.execute("SELECT * from users WHERE id = ?", [
    rows2.insertId,
  ]);
  console.log(result);

  return res
    .status(200)
    .json({ message: "User added successfully", data: result[0] });
};

export const updateUserController = async (req, res) => {
  const userId = req.params.id;
  const { name, email, age } = req.body;

  let query = "UPDATE users SET";
  let value = [];

  if (name) {
    query += " name = ?";
    value.push(name);
  }

  if (email) {
    query += " email = ?";
    value.push(email);
  }

  query += " WHERE id = ?";
  value.push(userId);
  console.log(query, value);

  const [rows] = await pool.execute(query, value);
  console.log("rows::::::::::::::::", rows);
};

export const deleteUserController = async (req, res) => {
  const userId = req.params.id;

  const [rows] = await pool.execute("DELETE FROM users WHERE id = ?", [userId]);

  console.log("rows::::::::::::", rows);
};
