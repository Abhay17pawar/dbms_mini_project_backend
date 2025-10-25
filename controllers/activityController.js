const db = require("../database");

/**
 * Retrieves all activities (seminars and workshops).
 */
exports.getActivities = (req, res) => {
  db.query("SELECT * FROM activities", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

/**
 * Creates a new activity (seminar or workshop).
 */
exports.createActivity = (req, res) => {
  const { type, scope, venue, speaker, topic, activity_date, activity_time, duration, club_id } = req.body;
  const query = `
    INSERT INTO activities 
    (type, scope, venue, speaker, topic, activity_date, activity_time, duration, club_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [type, scope, venue, speaker, topic, activity_date, activity_time, duration, club_id];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: result.insertId, ...req.body });
  });
};