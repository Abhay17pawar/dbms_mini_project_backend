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
 * Assigns a teacher as the incharge for a specific club.
 */
exports.assignClubIncharge = (req, res) => {
  const { clubId } = req.params;
  const { teacher_id } = req.body;

  if (!teacher_id) {
    return res.status(400).json({ message: "teacher_id is required." });
  }

  // 1. First, verify that the teacher exists.
  const checkTeacherQuery = "SELECT id FROM teachers WHERE id = ?";
  db.query(checkTeacherQuery, [teacher_id], (err, teacherResult) => {
    if (err) {
      return res.status(500).json(err);
    }

    // If no teacher is found, return a 404 error.
    if (teacherResult.length === 0) {
      return res.status(404).json({ message: `Teacher with id ${teacher_id} not found.` });
    }

    // 2. If the teacher exists, proceed with updating the club.
    const updateClubQuery = `
      UPDATE clubs 
      SET incharge_teacher_id = ? 
      WHERE id = ?
    `;

    db.query(updateClubQuery, [teacher_id, clubId], (err, updateResult) => {
      if (err) return res.status(500).json(err);
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: `Club with id ${clubId} not found.` });
      }
      res.json({ message: `Teacher ${teacher_id} assigned as incharge for club ${clubId}.` });
    });
  });
};

/**
 * Retrieves the teacher incharge for a specific club.
 */
exports.getClubIncharge = (req, res) => {
  const { clubId } = req.params;
  const query = "SELECT t.id, t.name, t.email, t.department FROM teachers t JOIN clubs c ON t.id = c.incharge_teacher_id WHERE c.id = ?";
  db.query(query, [clubId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0] || null); // Return the teacher object or null if not found
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
