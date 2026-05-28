const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Komal122000",
  database: "admin_panel",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL Connected");
  }
});

app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM admins WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      if (result.length > 0) {
        res.json({
          success: true,
          message: "Login Successful",
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Invalid Email or Password",
        });
      }
    }
  });
});
app.post("/api/admin/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logout Successful",
  });
});
app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
