const db = require("../database");
const { activityQueries } = require("../queries");

/**
 * Retrieves all activities (seminars and workshops).
 */
exports.getActivities = (req, res) => {
  db.query(activityQueries.getAll, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

/**
 * Creates a new activity (seminar or workshop).
 */
exports.createActivity = (req, res) => {
  const { type, scope, venue, speaker, topic, activity_date, activity_time, duration, club_id } = req.body;
  const values = [type, scope, venue, speaker, topic, activity_date, activity_time, duration, club_id];

  db.query(activityQueries.create, values, (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: result.insertId, ...req.body });
  });
};

/**
 * Retrieves a single activity by its ID.
 */
exports.getActivityById = (req, res) => {
  const { id } = req.params;
  db.query(activityQueries.getById, [id], (err, result) => {
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
  const values = [type, scope, venue, speaker, topic, activity_date, activity_time, duration, club_id, id];

  db.query(activityQueries.update, values, (err, result) => {
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
  db.query(activityQueries.delete, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  });
};