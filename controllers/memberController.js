const db = require("../database");
const { memberQueries } = require("../queries");

exports.getMembers = (req, res) => {
  db.query(memberQueries.getAll, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.createMember = (req, res) => {
  const { name, email, role, club_id } = req.body;
  db.query(
    memberQueries.create,
    [name, email, role, club_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, name, email, role, club_id });
    }
  );
};
