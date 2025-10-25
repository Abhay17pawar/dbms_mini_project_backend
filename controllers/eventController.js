const db = require("../database");

exports.getEvents = (req, res) => {
  db.query("SELECT * FROM events", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.createEvent = (req, res) => {
  const { title, description, date, time, club_id } = req.body;
  db.query(
    "INSERT INTO events (title, description, date, time, club_id) VALUES (?, ?, ?, ?, ?)",
    [title, description, date, time, club_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, title, description, date, time, club_id });
    }
  );
};
