const db = require("../database");
const { eventQueries } = require("../queries");

exports.getEvents = (req, res) => {
  db.query(eventQueries.getAll, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.createEvent = (req, res) => {
  const { title, description, date, time, club_id } = req.body;
  db.query(
    eventQueries.create,
    [title, description, date, time, club_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, title, description, date, time, club_id });
    }
  );
};
