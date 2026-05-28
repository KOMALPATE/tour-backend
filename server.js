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

app.post("/api/tours/add", (req, res) => {
  const {
    tour_name,
    destination,
    price,
    duration,
    start_date,
    end_date,
    description,
    image,
    status,
  } = req.body;

  const sql = `
    INSERT INTO tours
    (
      tour_name,
      destination,
      price,
      duration,
      start_date,
      end_date,
      description,
      image,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      tour_name,
      destination,
      price,
      duration,
      start_date,
      end_date,
      description,
      image,
      status,
    ],
    (err, result) => {
      if (err) {
        console.log(err);

        res.status(500).json(err);
      } else {
        res.json({
          success: true,
          message: "Tour Added Successfully",
        });
      }
    },
  );
});
app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
