const db = require("../database");

exports.getClubs = (req, res) => {
  db.query("SELECT * FROM clubs", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.createClub = (req, res) => {
  const { name, description } = req.body;
  db.query(
    "INSERT INTO clubs (name, description) VALUES (?, ?)",
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

  // This query uses INSERT...ON DUPLICATE KEY UPDATE (MySQL specific).
  // It requires a UNIQUE constraint on (club_id, member_id) in the club_members table.
  const query = `
    INSERT INTO club_members (club_id, member_id, role) 
    VALUES (?, ?, ?) 
    ON DUPLICATE KEY UPDATE role = VALUES(role)
  `;

  db.query(query, [clubId, member_id, role], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: `Role '${role}' assigned to member ${member_id} in club ${clubId}.` });
  });
};

/**
 * Retrieves all members with a 'head' role for a specific club.
 */
exports.getClubHeads = (req, res) => {
  const { clubId } = req.params;
  const query = "SELECT m.id, m.name, m.email, cm.role FROM members m JOIN club_members cm ON m.id = cm.member_id WHERE cm.club_id = ? AND cm.role LIKE '%head%'";
  db.query(query, [clubId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};
