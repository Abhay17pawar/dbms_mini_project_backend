const mysql = require('mysql2');
require('dotenv').config();

// Create a connection to MySQL server 
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'cms',
  port: process.env.DB_PORT,
  multipleStatements: true
});

// SQL script to create database and tables
const setupScript = `
CREATE DATABASE IF NOT EXISTS cms;

USE cms;

-- Create clubs table
CREATE TABLE IF NOT EXISTS clubs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('Secretary', 'Joint Secretary', 'Member') DEFAULT 'Member',
    club_id INT,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    club_id INT,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    allocated_amount DECIMAL(10,2),
    spent_amount DECIMAL(10,2),
    notes TEXT,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Create club_members table (junction table)
CREATE TABLE IF NOT EXISTS club_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT NOT NULL,
    member_id INT NOT NULL,
    role VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    UNIQUE KEY unique_member_in_club (club_id, member_id)
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('seminar', 'workshop') NOT NULL,
    scope ENUM('external', 'internal') NOT NULL,
    venue VARCHAR(255) NOT NULL,
    speaker VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    activity_date DATE NOT NULL,
    activity_time TIME NOT NULL,
    duration INT COMMENT 'Duration in minutes',
    club_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
);

-- Insert dummy data for clubs
INSERT INTO clubs (name, description) VALUES
('Computer Science Club', 'A club for computer science enthusiasts to learn and share knowledge about programming, AI, and technology'),
('Robotics Club', 'Building and programming robots, participating in competitions and workshops'),
('Photography Club', 'Exploring the art of photography through workshops, photo walks, and exhibitions'),
('Drama Club', 'Theatrical performances, play reading, and acting workshops'),
('Music Club', 'Learning instruments, vocal training, and organizing musical events');

-- Insert dummy data for members
INSERT INTO members (name, email, role, club_id) VALUES
('Rahul Sharma', 'rahul.sharma@example.com', 'Secretary', 1),
('Priya Patel', 'priya.patel@example.com', 'Joint Secretary', 1),
('Amit Kumar', 'amit.kumar@example.com', 'Member', 1),
('Sneha Reddy', 'sneha.reddy@example.com', 'Secretary', 2),
('Rohan Desai', 'rohan.desai@example.com', 'Joint Secretary', 2),
('Ananya Singh', 'ananya.singh@example.com', 'Member', 2),
('Kavya Iyer', 'kavya.iyer@example.com', 'Secretary', 3),
('Arjun Nair', 'arjun.nair@example.com', 'Member', 3),
('Ishaan Verma', 'ishaan.verma@example.com', 'Secretary', 4),
('Diya Gupta', 'diya.gupta@example.com', 'Member', 4),
('Aditya Joshi', 'aditya.joshi@example.com', 'Secretary', 5),
('Meera Rao', 'meera.rao@example.com', 'Member', 5);

-- Insert dummy data for events
INSERT INTO events (title, description, date, time, club_id) VALUES
('AI Workshop', 'Introduction to Machine Learning and Neural Networks', '2025-11-15', '14:00:00', 1),
('Hackathon 2025', '24-hour coding competition with exciting prizes', '2025-11-20', '09:00:00', 1),
('Robot Wars', 'Inter-college robotics competition', '2025-12-05', '10:00:00', 2),
('Drone Workshop', 'Learn to build and program drones', '2025-11-25', '15:00:00', 2),
('Photography Exhibition', 'Annual showcase of student photography', '2025-12-10', '11:00:00', 3),
('Portrait Workshop', 'Techniques for capturing stunning portraits', '2025-11-18', '16:00:00', 3),
('Annual Play', 'Shakespearean drama performance', '2025-12-15', '18:00:00', 4),
('Acting Workshop', 'Method acting and improvisation techniques', '2025-11-22', '17:00:00', 4),
('Battle of Bands', 'Inter-college music competition', '2025-12-20', '19:00:00', 5),
('Guitar Masterclass', 'Advanced guitar techniques with guest artist', '2025-11-28', '15:30:00', 5);

-- Insert dummy data for budgets
INSERT INTO budgets (event_id, allocated_amount, spent_amount, notes) VALUES
(1, 15000.00, 8500.00, 'Covers venue, equipment, and speaker fees'),
(2, 50000.00, 12000.00, 'Prizes, food, and infrastructure costs'),
(3, 30000.00, 25000.00, 'Arena setup, prizes, and promotion'),
(4, 20000.00, 5000.00, 'Materials and components for workshop'),
(5, 10000.00, 8000.00, 'Venue rental and printing costs'),
(6, 8000.00, 3000.00, 'Equipment rental and refreshments'),
(7, 35000.00, 20000.00, 'Costumes, props, and stage setup'),
(8, 12000.00, 4000.00, 'Guest instructor fees and materials'),
(9, 45000.00, 15000.00, 'Sound system, prizes, and promotion'),
(10, 18000.00, 6000.00, 'Guest artist fees and equipment');

-- Insert dummy data for club_members (junction table)
INSERT INTO club_members (club_id, member_id, role) VALUES
(1, 1, 'Secretary'),
(1, 2, 'Joint Secretary'),
(1, 3, 'Member'),
(2, 4, 'Secretary'),
(2, 5, 'Joint Secretary'),
(2, 6, 'Member'),
(3, 7, 'Secretary'),
(3, 8, 'Member'),
(4, 9, 'Secretary'),
(4, 10, 'Member'),
(5, 11, 'Secretary'),
(5, 12, 'Member');

-- Insert dummy data for activities
INSERT INTO activities (type, scope, venue, speaker, topic, activity_date, activity_time, duration, club_id) VALUES
('seminar', 'external', 'Auditorium A', 'Dr. Vikram Sharma', 'Future of Artificial Intelligence', '2025-11-10', '14:00:00', 120, 1),
('workshop', 'internal', 'Lab 201', 'Prof. Anjali Mehta', 'Web Development Basics', '2025-11-12', '15:00:00', 180, 1),
('seminar', 'external', 'Main Hall', 'Dr. Rajesh Kumar', 'Robotics in Healthcare', '2025-11-08', '11:00:00', 90, 2),
('workshop', 'internal', 'Workshop Room', 'Karan Malhotra', 'Arduino Programming', '2025-11-14', '13:00:00', 150, 2),
('workshop', 'external', 'Studio B', 'Nikhil Bhat', 'Advanced Lighting Techniques', '2025-11-16', '10:00:00', 120, 3),
('seminar', 'internal', 'Room 305', 'Kavya Iyer', 'Composition and Framing', '2025-11-09', '16:00:00', 90, 3),
('workshop', 'external', 'Theater Hall', 'Prof. Deepa Nambiar', 'Voice Modulation and Projection', '2025-11-11', '17:00:00', 120, 4),
('seminar', 'internal', 'Auditorium B', 'Ishaan Verma', 'History of Theater', '2025-11-13', '14:30:00', 60, 4),
('workshop', 'external', 'Music Room', 'Siddharth Chopra', 'Music Theory Fundamentals', '2025-11-17', '15:00:00', 150, 5),
('seminar', 'internal', 'Hall C', 'Aditya Joshi', 'Evolution of Rock Music', '2025-11-19', '16:00:00', 90, 5);
`;

// Function to setup database
function setupDatabase() {
  return new Promise((resolve, reject) => {
    connection.query(setupScript, (err, results) => {
      if (err) {
        console.error('Error setting up database:', err);
        reject(err);
      } else {
        console.log('Database setup completed successfully!');
        console.log('Created tables: clubs, members, events, budgets, club_members, activities');
        resolve(results);
      }
    });
  });
}

// Function to verify tables were created
function verifyTables() {
  return new Promise((resolve, reject) => {
    const verifyQuery = `
      USE cms;
      SHOW TABLES;
    `;
    
    connection.query(verifyQuery, (err, results) => {
      if (err) {
        console.error('Error verifying tables:', err);
        reject(err);
      } else {
        console.log('\nTables in database:');
        results.forEach(row => {
          console.log(`- ${Object.values(row)[0]}`);
        });
        resolve(results);
      }
    });
  });
}

// Main execution
async function main() {
  try {
    console.log('Starting database setup...');
    await setupDatabase();
    await verifyTables();
    console.log('\nDatabase setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    connection.end();
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { setupDatabase, verifyTables };
