const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const app = express();
app.use(bodyParser.json());
app.use(cors());

// กำหนดการเชื่อมต่อฐานข้อมูล MySQL
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'list',
// });
const connection = mysql.createConnection(process.env.DATABASE_URL)

// เพิ่มข้อมูล
app.post('/api/users', (req, res) => {
  const { rank, first_name, last_name, phone_number } = req.body;

  connection.query(
    'INSERT INTO users (rank, first_name, last_name, phone_number) VALUES (?, ?, ?, ?)',
    [rank, first_name, last_name, phone_number],
    (err, results) => {
      // if (err) throw err;

      res.json({ message: 'User created successfully', id: results.insertId });
    }
  );
});

// อ่านข้อมูลทั้งหมด
app.get('/api/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    // if (err) throw err;

    res.json(results);
  });
});

// อ่านข้อมูลตาม ID
app.get('/api/users/:id', (req, res) => {
  const id = req.params.id;

  connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    // if (err) throw err;

    if (results.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// อัปเดตข้อมูล
app.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const { rank, first_name, last_name, phone_number } = req.body;

  connection.query(
    'UPDATE users SET rank = ?, first_name = ?, last_name = ?, phone_number = ? WHERE id = ?',
    [rank, first_name, last_name, phone_number, id],
    (err, results) => {
      // if (err) throw err;

      res.json({ message: 'User updated successfully' });
    }
  );
});

// ลบข้อมูล
app.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;

  connection.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
    // if (err) throw err;

    res.json({ message: 'User deleted successfully' });
  });
});

// รันเซิร์ฟเวอร์
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
