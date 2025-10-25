const db = require("../database");

exports.getMembers = (req, res) => {
  db.query("SELECT * FROM members", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.createMember = (req, res) => {
  const { name, email, role, club_id } = req.body;
  db.query(
    "INSERT INTO members (name, email, role, club_id) VALUES (?, ?, ?, ?)",
    [name, email, role, club_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, name, email, role, club_id });
    }
  );
};
