-- SAVIOR AI — MySQL schema
CREATE DATABASE IF NOT EXISTS savior_ai CHARACTER SET utf8mb4;
USE savior_ai;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  age INT,
  profile_image VARCHAR(500),
  role VARCHAR(40) DEFAULT 'user',
  premium_status BOOLEAN DEFAULT FALSE,
  impact_score INT DEFAULT 0,
  eco_points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS waste_scans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  image_url VARCHAR(500),
  waste_type VARCHAR(160),
  materials JSON,
  condition_text VARCHAR(160),
  current_value DECIMAL(10,2),
  future_value DECIMAL(10,2),
  solutions JSON,
  impact_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agent_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  scan_id INT NOT NULL,
  agent_name VARCHAR(80),
  input_data JSON,
  output_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (scan_id) REFERENCES waste_scans(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS food_share (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  food_name VARCHAR(160),
  quantity VARCHAR(80),
  location VARCHAR(160),
  price VARCHAR(40),
  freshness_status VARCHAR(80),
  status VARCHAR(40) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ngo_campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ngo_name VARCHAR(160),
  title VARCHAR(200),
  description TEXT,
  category VARCHAR(80),
  location VARCHAR(160),
  image VARCHAR(500),
  goal_amount DECIMAL(12,2),
  current_amount DECIMAL(12,2) DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  campaign_id INT NOT NULL,
  amount DECIMAL(10,2),
  impact_created VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (campaign_id) REFERENCES ngo_campaigns(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS leaderboard (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  impact_score INT DEFAULT 0,
  rank_position INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  badge_name VARCHAR(80),
  badge_level VARCHAR(40),
  earned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS premium_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan VARCHAR(40),
  features JSON,
  expiry_date DATE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
