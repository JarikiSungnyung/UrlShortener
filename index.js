require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const schedule = require("node-schedule");
let nanoid;
import("nanoid").then((nano) => {
  nanoid = nano.nanoid;
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database.");
});

const app = express();
app.use(express.json());

app.post("/shorten", async (req, res) => {
  const { url } = req.body;
  const id = await nanoid(10);
  const query = "INSERT INTO urls (id, original_url) VALUES (?, ?)";

  db.query(query, [id, url], (err, result) => {
    if (err) throw err;

    const deleteJob = schedule.scheduleJob(Date.now() + 24 * 60 * 60 * 1000, () => {
      const deleteQuery = "DELETE FROM urls WHERE id = ?";
      db.query(deleteQuery, id, (err, result) => {
        if (err) throw err;
        console.log(`Deleted ${id} from the database.`);
      });
    });

    res.json({ short_url: `${process.env.DOMAIN}/${id}` });
  });
});

app.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT original_url FROM urls WHERE id = ?";

  db.query(query, id, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.redirect(result[0].original_url);
    } else {
      res.sendStatus(404);
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
