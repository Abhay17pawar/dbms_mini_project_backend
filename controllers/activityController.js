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

/**
 * Retrieves a single activity by its ID.
 */
exports.getActivityById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM activities WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(result[0]);
  });
};

/**
 * Updates an existing activity.
 */
exports.updateActivity = (req, res) => {
  const { id } = req.params;
  const { type, scope, venue, speaker, topic, activity_date, activity_time, duration, club_id } = req.body;
  const query = `
    UPDATE activities SET 
    type = ?, scope = ?, venue = ?, speaker = ?, topic = ?, 
    activity_date = ?, activity_time = ?, duration = ?, club_id = ? 
    WHERE id = ?
  `;
  const values = [type, scope, venue, speaker, topic, activity_date, activity_time, duration, club_id, id];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json({ message: "Activity updated successfully" });
  });
};

/**
 * Deletes an activity by its ID.
 */
exports.deleteActivity = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM activities WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  });
};