const db = require("../database");

exports.getBudgets = (req, res) => {
  db.query("SELECT * FROM budgets", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.createBudget = (req, res) => {
  const { event_id, allocated_amount, spent_amount, notes } = req.body;
  db.query(
    "INSERT INTO budgets (event_id, allocated_amount, spent_amount, notes) VALUES (?, ?, ?, ?)",
    [event_id, allocated_amount, spent_amount, notes],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, event_id, allocated_amount, spent_amount, notes });
    }
  );
};
