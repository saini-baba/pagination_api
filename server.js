const express = require("express");
const app = express();
const db = require("./db/db.js");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.get("/data/:search/:limit/:page", (req, res) => {
  const { page, limit} = req.params;
  let { search } = req.params;
  // console.log(search);
  const offset = (page - 1) * limit;
  let result = [];
  if (search === "null") {
    search = null;
  }
  if (search !== null) {
    console.log(search);
    const query = `
      SELECT * FROM job 
      WHERE name LIKE ? 
      OR age = ? 
      OR id = ? 
      OR email LIKE ? 
      OR salary = ? LIMIT ? OFFSET ?;
    `;

    const query2 = `
      SELECT count(*) FROM job 
      WHERE name LIKE ? 
      OR age = ? 
      OR id = ? 
      OR email LIKE ? 
      OR salary = ? LIMIT ? OFFSET ?;
    `;

    const queryParams = [
      `${search}%`,
      search,
      search,
      `${search}%`,
      search,
      parseInt(limit),
      parseInt(offset),
    ];

    db.query(query, queryParams, (err, res) => {
      if (err) {
        console.error("Error executing query:", err.stack);
        return res.status(500).send("Error retrieving data from the database");
      }
      result = res;
    });

    db.query(query2, queryParams, (err, countResult) => {
      if (err) {
        console.error("Error executing query:", err.stack);
        return res.status(500).send("Error retrieving count of data");
      } else {
        return res.status(200).json({
          result: result,
          totalitem: countResult,
        });
      }
    });
  } else {
    db.query(
      `SELECT * FROM job LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)};`,
      (err, res) => {
        if (err) {
          console.error("Error executing query:", err.stack);
          return res
            .status(500)
            .send("Error retrieving data from the database");
        }
        result = res;
      }
    );
    db.query("select count(*) from job", (err, countResult) => {
      if (err) {
        console.error("Error executing query:", err.stack);
        return res.status(500).send("Error retrieving count of data");
      } else {
        return res.status(200).json({
          result: result,
          totalitem: countResult,
        });
      }
    });
  }
});
app.listen(5000, () => {
  console.log("running");
});
