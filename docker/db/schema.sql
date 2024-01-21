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

CREATE TABLE genders (
  gender_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  gender_name VARCHAR(100) NOT NULL
);

INSERT INTO genders (
  gender_id, gender_name
) VALUES 
  (DEFAULT, "MALE"),
  (DEFAULT, "FEMALE"),
  (DEFAULT, "TRANSGENDER"),
  (DEFAULT, "NON-BINARY/NON-CONFORMING"),
  (DEFAULT, "PREFER NOT TO SAY");

CREATE TABLE users (
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(80) DEFAULT NULL,
  username VARCHAR(100) DEFAULT NULL,
  first_name VARCHAR(100) DEFAULT NULL,
  last_name VARCHAR(100) DEFAULT NULL,
  auth_method_id INT NOT NULL DEFAULT 1,
  apple_user_id VARCHAR(356) DEFAULT NULL,
  google_user_id VARCHAR(356) DEFAULT NULL,
  google_profile_picture_url VARCHAR(256) DEFAULT NULL,
  password VARCHAR(256) NOT NULL UNIQUE,
  do_not_use TINYINT(1) NOT NULL DEFAULT 0,
  ffq_complete TINYINT(1) DEFAULT 0,
  dob DATE DEFAULT NULL,
  gender VARCHAR(50) DEFAULT NULL,
  origin VARCHAR(100) DEFAULT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE INDEX `idx_email` (`email`),
  UNIQUE INDEX `idx_username` (`username`),
  FOREIGN KEY (auth_method_id) REFERENCES user_auth_methods (auth_method_id),
  FOREIGN KEY (gender_id) REFERENCES genders (gender_id)
);

INSERT INTO users (
  user_id, email, username, auth_method_id, password
) VALUES (
  DEFAULT, "user@user.com", "awf825", 1, "$2a$10$DXgd1cwymsh1Ssa/QOO0weXXbnX8uU1nLf71aKn558QDWeZQtKtFa"
);
-- hash for 'password' ^^^

CREATE TABLE forms (
  form_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  form_name VARCHAR(50) NOT NULL
);

INSERT INTO forms (
  form_id, form_name
) VALUES 
  (DEFAULT, "FFQ"),
  (DEFAULT, "Weekly");

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
  (DEFAULT, "ACTIVITY"),
  (DEFAULT, "FFQ"), /* ffq -> multiple radio */
  (DEFAULT, "USER");

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
  (DEFAULT, "DOB"),
  (DEFAULT, "SELECT-ORIGIN"),
  (DEFAULT, "FFQ-FREQ-A"), /* NEVER, 1-6 times per year, once a month, etc*/
  (DEFAULT, "FFQ-FREQ-B"), /* NEVER, 1 time per month or less, etc*/
  (DEFAULT, "FFQ-FREQ-C"), /* almost never or never, about 1/4 of the time */
  (DEFAULT, "FFQ-STANDARD"), /* 1/2 cup, 1 cup etc*/
  (DEFAULT, "FFQ-METRIC"), /* 1 liter, 2 liter, etc */
  (DEFAULT, "FFQ-UNITS"), /* 1 unit of alcohol, 2 units of alcohol, etc */
  (DEFAULT, "GENDER");

CREATE TABLE question_answer_options (
  option_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  field_type_id INT NOT NULL,
  option_text VARCHAR(100) NOT NULL,
  ordering INT NOT NULL, 
  FOREIGN KEY (field_type_id) REFERENCES question_field_types (field_type_id)
);

/*
  In development, I have "ordering" ultimately being recorded as the value the from
  takes in. This is probably better suited to its own column

  If ordering is "-1", this is not a selection, and will be validated as such by formik
*/

INSERT INTO question_answer_options (
  option_id, field_type_id, option_text, ordering
) VALUES 
  (DEFAULT, 6, "Please select an option", -1),   /* BEGIN SELECT-ORIGIN */    
  (DEFAULT, 6, "United States", 1),
  (DEFAULT, 6, "Spain", 2),
  (DEFAULT, 6, "Austrailia", 3),                 /* END SELECT-ORIGIN */
  (DEFAULT, 7, "NEVER", 1),                      /* BEGIN FFQ-FREQ-A */
  (DEFAULT, 7, "1-6 times per year", 2),
  (DEFAULT, 7, "7-11 times per year", 3),
  (DEFAULT, 7, "Once per month", 4),
  (DEFAULT, 7, "2-3 times per month", 5),
  (DEFAULT, 7, "1 time per week", 6),
  (DEFAULT, 7, "Twice per week", 7),
  (DEFAULT, 7, "3-4 times per week", 8),
  (DEFAULT, 7, "5-6 times per week", 9),
  (DEFAULT, 7, "1 time per day", 10),
  (DEFAULT, 7, "2 or more times per day", 11),  /* END FFQ-FREQ-A */
  (DEFAULT, 8, "Almost never or never", 1),       /* BEGIN FFQ-FREQ-B */
  (DEFAULT, 8, "About 1/4 of the time", 2),
  (DEFAULT, 8, "About 1/2 of the time", 3),
  (DEFAULT, 8, "About 3/4 of the time", 4),
  (DEFAULT, 8, "Almost always or always", 5),     /* END FFQ-FREQ-B */
  (DEFAULT, 9, "NEVER", 1),                         /* BEGIN FFQ-FREQ-C */
  (DEFAULT, 9, "1 time per month", 2),
  (DEFAULT, 9, "2-3 times per month", 3),
  (DEFAULT, 9, "1-2 times per week", 4),
  (DEFAULT, 9, "3-4 times perr week", 5),
  (DEFAULT, 9, "5-6 times per week", 6),
  (DEFAULT, 9, "1 time per day", 7),
  (DEFAULT, 9, "2-3 times per day", 8),
  (DEFAULT, 9, "4-5 times per day", 9),
  (DEFAULT, 9, "6 or more times per day", 10);      /* END FFQ-FREQ-C */
  (DEFAULT, 13, "Male", 1),                     /* BEGIN GENDER */
  (DEFAULT, 13, "Female", 2),
  (DEFAULT, 13, "Transgender", 3),
  (DEFAULT, 13, "Binary/Non-conforming", 4),
  (DEFAULT, 13, "Prefer not to say", 5);        /* END GENDER */

CREATE TABLE questions (
  question_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  question_text VARCHAR(540) NOT NULL UNIQUE,
  category_id INT NOT NULL,
  field_type_id INT NOT NULL,
  field_code VARCHAR(15) NOT NULL,
  form_id INT NOT NULL,
  UNIQUE INDEX `idx_question_text` (`question_text`),
  FOREIGN KEY (category_id) REFERENCES question_categories (category_id),
  FOREIGN KEY (field_type_id) REFERENCES question_field_types (field_type_id),
  FOREIGN KEY (form_id) REFERENCES forms (form_id)
);

INSERT INTO questions (
  question_id, question_text, category_id, field_type_id, field_code, form_id
) VALUES 
  (DEFAULT, "How often did you eat baked ham or ham steak?", 4, 7, "ham", 1),
  (DEFAULT, "How often were the soups you ate cream soups (including chowders)?", 4, 8, "creamsoup", 1),
  (DEFAULT, "How often did you drink beer IN THE SUMMER?", 4, 9, "beer", 1),
  (DEFAULT, "Please select your gender.", 6, 13, "gender", 1),
  (DEFAULT, "PLease select your date of birth.", 6, 5, "dob", 1),
  (DEFAULT, "Please select your country of origin.", 6, 6, "origin", 1);

CREATE TABLE question_answer_submissions (
  submission_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  form_id INT NOT NULL,
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