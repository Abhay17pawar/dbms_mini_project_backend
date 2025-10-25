const express = require('express');
require('dotenv').config();
const { pool } = require('./database'); 
const clubRoutes = require("./routes/clubRoute");
const memberRoutes = require("./routes/memberRoute");
const eventRoutes = require("./routes/eventRoute");
const budgetRoutes = require("./routes/budgetRoute"); 
const activityRoutes = require("./routes/activityRoute");

const app = express();
app.use(express.json()); 

const PORT = 3000;

app.use("/clubs", clubRoutes);
app.use("/members", memberRoutes);
app.use("/events", eventRoutes);
app.use("/budgets", budgetRoutes);
app.use("/activities", activityRoutes);

pool.getConnection((err, conn) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Database connected successfully');
    conn.release();

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  }
}); 


// additional features : 

// budget form : title, approved (sec, faculty , JD) , transfer

// inside club (design head, tech head, event head, content head, marketing head, finance head)

// seminar s, workshops (external, internal) --> venue, speaker, topic, date, time, duration, club_id

// event feedback form (rating, comments, suggestions)
