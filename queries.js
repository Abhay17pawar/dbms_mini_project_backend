// Club Queries
const clubQueries = {
  getAll: "SELECT * FROM clubs",
  create: "INSERT INTO clubs (name, description) VALUES (?, ?)",
  getById: "SELECT * FROM clubs WHERE id = ?",
  update: "UPDATE clubs SET name = ?, description = ? WHERE id = ?",
  delete: "DELETE FROM clubs WHERE id = ?",
  
  // Club-specific queries
  assignHead: `
    INSERT INTO club_members (club_id, member_id, role) 
    VALUES (?, ?, ?) 
    ON DUPLICATE KEY UPDATE role = VALUES(role)
  `,
  getHeads: `
    SELECT m.id, m.name, m.email, cm.role 
    FROM members m 
    JOIN club_members cm ON m.id = cm.member_id 
    WHERE cm.club_id = ? AND cm.role LIKE '%Secretary%'
  `,
  getEvents: "SELECT * FROM events WHERE club_id = ?",
  getBudget: `
    SELECT b.*, e.title as event_title
    FROM budgets b
    JOIN events e ON b.event_id = e.id
    WHERE e.club_id = ?
  `,
  getActivities: "SELECT * FROM activities WHERE club_id = ?"
};

// Member Queries
const memberQueries = {
  getAll: "SELECT * FROM members",
  create: "INSERT INTO members (name, email, role, club_id) VALUES (?, ?, ?, ?)",
  getById: "SELECT * FROM members WHERE id = ?",
  update: "UPDATE members SET name = ?, email = ?, role = ?, club_id = ? WHERE id = ?",
  delete: "DELETE FROM members WHERE id = ?",
  
  // Member-specific queries
  getByClub: "SELECT * FROM members WHERE club_id = ?",
  getByRole: "SELECT * FROM members WHERE role = ?",
  getByEmail: "SELECT * FROM members WHERE email = ?"
};

// Event Queries
const eventQueries = {
  getAll: "SELECT * FROM events",
  create: "INSERT INTO events (title, description, date, time, club_id) VALUES (?, ?, ?, ?, ?)",
  getById: "SELECT * FROM events WHERE id = ?",
  update: "UPDATE events SET title = ?, description = ?, date = ?, time = ?, club_id = ? WHERE id = ?",
  delete: "DELETE FROM events WHERE id = ?",
  
  // Event-specific queries
  getByClub: "SELECT * FROM events WHERE club_id = ?",
  getUpcoming: "SELECT * FROM events WHERE date >= CURDATE() ORDER BY date ASC",
  getPast: "SELECT * FROM events WHERE date < CURDATE() ORDER BY date DESC",
  getByDateRange: "SELECT * FROM events WHERE date BETWEEN ? AND ?"
};

// Budget Queries
const budgetQueries = {
  getAll: "SELECT * FROM budgets",
  create: "INSERT INTO budgets (event_id, allocated_amount, spent_amount, notes) VALUES (?, ?, ?, ?)",
  getById: "SELECT * FROM budgets WHERE id = ?",
  update: "UPDATE budgets SET event_id = ?, allocated_amount = ?, spent_amount = ?, notes = ? WHERE id = ?",
  delete: "DELETE FROM budgets WHERE id = ?",
  
  // Budget-specific queries
  getByEvent: "SELECT * FROM budgets WHERE event_id = ?",
  getTotalAllocated: "SELECT SUM(allocated_amount) as total FROM budgets",
  getTotalSpent: "SELECT SUM(spent_amount) as total FROM budgets",
  getBudgetSummary: `
    SELECT 
      SUM(allocated_amount) as total_allocated,
      SUM(spent_amount) as total_spent,
      SUM(allocated_amount - spent_amount) as remaining
    FROM budgets
  `,
  getBudgetByClub: `
    SELECT b.*, e.title as event_title
    FROM budgets b
    JOIN events e ON b.event_id = e.id
    WHERE e.club_id = ?
  `
};

// Activity Queries
const activityQueries = {
  getAll: "SELECT * FROM activities",
  create: `
    INSERT INTO activities 
    (type, scope, venue, speaker, topic, activity_date, activity_time, duration, club_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  getById: "SELECT * FROM activities WHERE id = ?",
  update: `
    UPDATE activities SET 
    type = ?, scope = ?, venue = ?, speaker = ?, topic = ?, 
    activity_date = ?, activity_time = ?, duration = ?, club_id = ? 
    WHERE id = ?
  `,
  delete: "DELETE FROM activities WHERE id = ?",
  
  // Activity-specific queries
  getByClub: "SELECT * FROM activities WHERE club_id = ?",
  getByType: "SELECT * FROM activities WHERE type = ?",
  getByScope: "SELECT * FROM activities WHERE scope = ?",
  getUpcoming: "SELECT * FROM activities WHERE activity_date >= CURDATE() ORDER BY activity_date ASC",
  getPast: "SELECT * FROM activities WHERE activity_date < CURDATE() ORDER BY activity_date DESC",
  getByDateRange: "SELECT * FROM activities WHERE activity_date BETWEEN ? AND ?"
};

// Club Members (Junction Table) Queries
const clubMemberQueries = {
  getAll: "SELECT * FROM club_members",
  create: "INSERT INTO club_members (club_id, member_id, role) VALUES (?, ?, ?)",
  getById: "SELECT * FROM club_members WHERE id = ?",
  update: "UPDATE club_members SET role = ? WHERE id = ?",
  delete: "DELETE FROM club_members WHERE id = ?",
  
  // Club-member specific queries
  getByClub: "SELECT * FROM club_members WHERE club_id = ?",
  getByMember: "SELECT * FROM club_members WHERE member_id = ?",
  getMembersWithDetails: `
    SELECT cm.*, m.name, m.email, c.name as club_name
    FROM club_members cm
    JOIN members m ON cm.member_id = m.id
    JOIN clubs c ON cm.club_id = c.id
    WHERE cm.club_id = ?
  `,
  removeFromClub: "DELETE FROM club_members WHERE club_id = ? AND member_id = ?"
};

module.exports = {
  clubQueries,
  memberQueries,
  eventQueries,
  budgetQueries,
  activityQueries,
  clubMemberQueries
};
