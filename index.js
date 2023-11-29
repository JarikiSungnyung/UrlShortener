const express = require("express");
const mysql = require("mysql2");
let nanoid;
import("nanoid").then((nano) => {
  nanoid = nano.nanoid;
});

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "!dmsgur0327",
  database: "urlshortener",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

app.post("/shorten", async (req, res) => {
  const { url } = req.body;
  const id = await nanoid(10);
  const query = "INSERT INTO urls (id, original_url) VALUES (?, ?)";

  db.query(query, [id, url], (err, result) => {
    if (err) throw err;
    res.json({ short_url: `http://localhost:3000/${id}` });
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
  console.log("Server started on port 3000");
});
