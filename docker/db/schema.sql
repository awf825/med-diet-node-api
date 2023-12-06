CREATE TABLE user_auth_methods (
  auth_method_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  auth_method_name VARCHAR(100)
);

INSERT INTO user_auth_methods (
  auth_method_id, auth_method_name
) VALUES 
  (DEFAULT, "DEFAULT"),
  (DEFAULT, "GOOGLE"),
  (DEFAULT, "APPLE");

CREATE TABLE users (
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(80) DEFAULT NULL,
  username VARCHAR(100) DEFAULT NULL,
  auth_method_id INT NOT NULL DEFAULT 1,
  password VARCHAR(256) NOT NULL UNIQUE,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE INDEX `idx_email` (`email`),
  UNIQUE INDEX `idx_username` (`username`),
  FOREIGN KEY (auth_method_id) REFERENCES user_auth_methods (auth_method_id)
);

INSERT INTO users (
  user_id, email, username, auth_method_id, password
) VALUES (
  DEFAULT, "user@user.com", "awf825", 1, "$2a$10$DXgd1cwymsh1Ssa/QOO0weXXbnX8uU1nLf71aKn558QDWeZQtKtFa"
);

-- hash for 'password' ^^^

CREATE TABLE question_field_types (
  field_type_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  field_name VARCHAR(50) NOT NULL
);

INSERT INTO question_field_types (
  field_type_id, field_name
) VALUES 
  (DEFAULT, "NUMBER"),
  (DEFAULT, "RADIO"),
  (DEFAULT, "TEXT"),
  (DEFAULT, "TEXTAREA"),
  (DEFAULT, "SELECT");

CREATE TABLE question_categories (
  category_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(100) NOT NULL
);

INSERT INTO question_categories (
  category_id, category_name
) VALUES 
  (DEFAULT, "FOOD"),
  (DEFAULT, "FLOURISHING"),
  (DEFAULT, "DRINK"),
  (DEFAULT, "ACTIVITY");

CREATE TABLE questions (
  question_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  question_text VARCHAR(240) NOT NULL UNIQUE,
  field_type VARCHAR(50) NOT NULL,
  field_code VARCHAR(20) NOT NULL,
  category_id INT NOT NULL,
  UNIQUE INDEX `idx_question_text` (`question_text`),
  FOREIGN KEY (category_id) REFERENCES question_categories (category_id)
);

INSERT INTO questions (
  question_id, question_text, field_type, field_code, category_id
) VALUES 
  (DEFAULT, "How many times a day did you poop this week?", "INT", "poop", 4),
  (DEFAULT, "How many minutes this week have you spent meditating?", "INT", "meditate", 2),
  (DEFAULT, "How many servings of red meat have you had this week?", "INT", "redmeat", 1),
  (DEFAULT, "Have you attended any religious services this week?", "TEXT", "religious", 2),
  (DEFAULT, "How many ounces of whole milk have you drank this week?", "INT", "milk", 3),
  (DEFAULT, "How many hours of physical exercise have you had this week?", "INT", "exercise", 4);

CREATE TABLE question_answer_submissions (
  submission_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  score INT,
  completed_at TIMESTAMP NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE question_answers (
  answer_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  question_id INT NOT NULL, 
  question_answer_submission_id INT UNSIGNED, 
  answer_score INT DEFAULT NULL,
  FOREIGN KEY (question_id) REFERENCES questions (question_id),
  FOREIGN KEY (question_answer_submission_id) REFERENCES question_answer_submissions (submission_id)
);