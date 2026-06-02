const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 4000;
const mysql = require("mysql2");

const jwt = require("jsonwebtoken");

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

//// Admin Login and Logout

app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM admins WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      if (result.length > 0) {
        const token = jwt.sign(
          {
            id: result[0].id,
            email: result[0].email,
          },
          "mysecretkey",
          { expiresIn: "1h" },
        );
        res.json({
          success: true,
          message: "Login Successful",
          token: token,
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

//// Tours CRUD Operations

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

app.get("/api/tours", (req, res) => {
  const sql = "SELECT * FROM tours ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

app.delete("/api/tours/delete/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM tours WHERE id=?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({
        success: true,
        message: "Tour Deleted Successfully",
      });
    }
  });
});

app.put("/api/tours/update/:id", (req, res) => {
  const id = req.params.id;

  const {
    tour_name,
    destination,
    price,
    duration,
    start_date,
    end_date,
    status,
  } = req.body;

  const sql = `
    UPDATE tours
    SET
      tour_name=?,
      destination=?,
      price=?,
      duration=?,
      start_date=?,
      end_date=?,
      status=?
    WHERE id=?
  `;

  db.query(
    sql,
    [tour_name, destination, price, duration, start_date, end_date, status, id],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json({
          success: true,
          message: "Tour Updated Successfully",
        });
      }
    },
  );
});

app.post("/api/packages/add", (req, res) => {
  const {
    package_name,
    destination,
    price,
    duration_days,
    duration_nights,
    hotel_name,
    status,
  } = req.body;

  const sql = `
    INSERT INTO packages
    (
      package_name,
      destination,
      duration_days,
      duration_nights,
      price,
      hotel_name,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      package_name,
      destination,
      duration_days,
      duration_nights,
      price,
      hotel_name,
      status,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({
        success: true,
        message: "Package Added Successfully",
      });
    },
  );
});

app.get("/api/packages", (req, res) => {
  const sql = "SELECT * FROM packages ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

app.post("/app/inquiry/add", (req, res) => {
  const { customer_name, phone, destination, package_name, status } = req.body;

  const sql = `INSERT INTO inquiries
  (customer_name,phone,destination,package_name,status) VALUES (?,?,?,?,?)`;

  db.query(
    sql,
    [customer_name, phone, destination, package_name, status],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      const inquiryID = result.insertId;

      // Insert into inquiry_logs
      db.query(
        `
        INSERT INTO inquiry_timeline
        (
          inquiry_id,
          status,
          remarks
        )
        VALUES(?,?,?)
        `,
        [inquiryId, "New Inquiry", "Customer submitted inquiry"],
      );

      res.json({
        success: true,
        message: "Inquiry Added Successfully",
      });
    },
  );
});

app.get("/api/inquiries", (req, res) => {
  const sql = `
    SELECT
      i.id,
      u.customer_name,
      u.phone,
      i.destination,
      i.package_name,
      i.status,
      i.created_at
    FROM inquiries i
    JOIN users u
    ON i.user_id = u.id
    ORDER BY i.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
});
app.get("/api/users", (req, res) => {
  const sql = "SELECT * FROM users ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

app.get("/api/timeline/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT *
    FROM inquiry_timeline
    WHERE inquiry_id = ?
    ORDER BY created_at ASC
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
