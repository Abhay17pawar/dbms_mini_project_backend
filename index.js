const express = require('express');
const cors = require('cors');
const { pool } = require('./database'); 
const clubRoutes = require("./routes/clubRoute");
const memberRoutes = require("./routes/memberRoute");
const eventRoutes = require("./routes/eventRoute");
const budgetRoutes = require("./routes/budgetRoute"); 
const activityRoutes = require("./routes/activityRoute");

const app = express();

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json()); 

const PORT = 3000;

app.use("/clubs", clubRoutes);
app.use("/members", memberRoutes);
app.use("/events", eventRoutes);
app.use("/budgets", budgetRoutes);
app.use("/activities", activityRoutes);

pool.getConnection((err, conn) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('Database connected successfully');
    conn.release();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
}); 
