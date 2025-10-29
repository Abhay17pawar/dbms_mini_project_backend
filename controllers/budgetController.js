const db = require("../database");
const { budgetQueries } = require("../queries");

exports.getBudgets = (req, res) => {
  db.query(budgetQueries.getAll, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.createBudget = (req, res) => {
  const { event_id, allocated_amount, spent_amount, notes } = req.body;
  db.query(
    budgetQueries.create,
    [event_id, allocated_amount, spent_amount, notes],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, event_id, allocated_amount, spent_amount, notes });
    }
  );
};
