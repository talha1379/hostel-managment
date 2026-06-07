import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./hostel.db");

db.run(`
CREATE TABLE IF NOT EXISTS residents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fullName TEXT,
  phone TEXT
)
`);

app.post("/api/add-resident", (req, res) => {
  const { fullName, phone } = req.body;

  db.run(
    "INSERT INTO residents(fullName, phone) VALUES (?, ?)",
    [fullName, phone],
    function (err) {
      if (err) {
        res.json({
          success: false,
        });
      } else {
        res.json({
          success: true,
        });
      }
    },
  );
});

app.listen(3000, () => {
  console.log("Server Running");
});
