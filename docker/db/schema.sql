CREATE TABLE users (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(80) NOT NULL UNIQUE,
  username VARCHAR(100) UNIQUE,
  password VARCHAR(16) NOT NULL UNIQUE,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (
    id, email, username, password
) VALUES (
    DEFAULT, "user@user.com", "awf825", "password1"
);

-- CREATE TABLE questions (
--     question_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
--     title VARCHAR(240) NOT NULL UNIQUE,
--     text VARCHAR(240) NOT NULL UNIQUE,
-- )

-- CREATE TABLE answers (
--     answer_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
--     question_id
-- )

-- CREATE TABLE question_answers (

-- )