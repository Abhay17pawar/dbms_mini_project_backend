const db = require("../database");
const { clubQueries } = require("../queries");

exports.getClubs = (req, res) => {
  db.query(clubQueries.getAll, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.createClub = (req, res) => {
  const { name, description } = req.body;
  db.query(
    clubQueries.create,
    [name, description],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, name, description });
    }
  );
};

/**
 * Assigns a role to a member within a club.
 * This can be used to set roles like 'design head', 'tech head', etc.
 * Assumes a `club_members` table exists to store these relationships.
 * If a member already has a role in the club, it will be updated.
 */
exports.assignClubHead = (req, res) => {
  const { clubId } = req.params;
  const { member_id, role } = req.body;

  if (!member_id || !role) {
    return res.status(400).json({ message: "member_id and role are required." });
  }

  db.query(clubQueries.assignHead, [clubId, member_id, role], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: `Role '${role}' assigned to member ${member_id} in club ${clubId}.` });
  });
};

/**
 * Retrieves all members with a 'head' role for a specific club.
 */
exports.getClubHeads = (req, res) => {
  const { clubId } = req.params;
  db.query(clubQueries.getHeads, [clubId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

/**
 * Retrieves all events for a specific club.
 */
exports.getEventsForClub = (req, res) => {
  const { clubId } = req.params;
  db.query(clubQueries.getEvents, [clubId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

/**
 * Retrieves the budget for a specific club by summing budgets of its events.
 */
exports.getClubBudget = (req, res) => {
  const { clubId } = req.params;
  db.query(clubQueries.getBudget, [clubId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

/**
 * Retrieves all activities for a specific club.
 */
exports.getActivitiesForClub = (req, res) => {
  const { clubId } = req.params;
  db.query(clubQueries.getActivities, [clubId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};
