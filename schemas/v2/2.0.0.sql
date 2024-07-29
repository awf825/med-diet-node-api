/*
    UPDATES
    REMOVED positive_impact from `questions`
    ADDED display_hex_code to `question_categories`

*/

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
  FOREIGN KEY (auth_method_id) REFERENCES user_auth_methods (auth_method_id)
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
  (DEFAULT, "FFQ-56"),
  (DEFAULT, "D-25");

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
  (DEFAULT, "GENDER"),
  (DEFAULT, "WKLY-QTY"), /* NONE, 1-2 servings, 3-4 servings etc*/
  (DEFAULT, "WKLY-FREQ"), /* NOT ONCE, ONE DAY, 2-3 DAYS, 4 OR MORE DAYS */
  (DEFAULT, "WKLY-BIN-POSITIVE");
  (DEFAULT, "WKLY-BIN-NEGATIVE");

CREATE TABLE question_answer_options (
  option_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  field_type_id INT NOT NULL,
  option_text VARCHAR(100) NOT NULL,
  answer_value INT NOT NULL, 
  description VARCHAR(300) DEFAULT NULL,
  FOREIGN KEY (field_type_id) REFERENCES question_field_types (field_type_id)
);

INSERT INTO question_answer_options (
  option_id, field_type_id, option_text, answer_value, description
) VALUES 
  (DEFAULT, 6, "Please select an option", -1),   /* BEGIN SELECT-ORIGIN */    
  (DEFAULT, 6, "United States", 1),
  (DEFAULT, 6, "Spain", 2),
  (DEFAULT, 6, "Austrailia", 3),                 /* END SELECT-ORIGIN */
  (DEFAULT, 7, "Never, or less than once a month", 1),                      /* BEGIN FFQ-FREQ-A */
  (DEFAULT, 7, "1-3 times a month", 2),
  (DEFAULT, 7, "Once per month", 3),
  (DEFAULT, 7, "Once per week", 4),
  (DEFAULT, 7, "2-4 times a week", 5),
  (DEFAULT, 7, "5-6 times a week", 6),
  (DEFAULT, 7, "Once per day", 7),
  (DEFAULT, 7, "2-3 times per day", 8),
  (DEFAULT, 7, "4-5 times per day", 9),
  (DEFAULT, 7, "6 or more times a day", 10),           /* END FFQ-FREQ-A */
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
  (DEFAULT, 9, "6 or more times per day", 10),      /* END FFQ-FREQ-C */
  (DEFAULT, 13, "Male", 1),                     /* BEGIN GENDER */
  (DEFAULT, 13, "Female", 2),
  (DEFAULT, 13, "Transgender", 3),
  (DEFAULT, 13, "Binary/Non-conforming", 4),
  (DEFAULT, 13, "Prefer not to say", 5),        /* END GENDER */
  (DEFAULT, 14, "None", 1),                     /* BEGIN WKLY-QTY */
  (DEFAULT, 14, "1-2 servings", 2), 
  (DEFAULT, 14, "3-4 servings", 3), 
  (DEFAULT, 14, "5 or more servings", 4),       /* END WKLY-QTY */
  (DEFAULT, 15, "Never", 1),                    /* BEGIN WKLY-FREQ */
  (DEFAULT, 15, "1 day", 2), 
  (DEFAULT, 15, "2-3 days", 3), 
  (DEFAULT, 15, "4 or more days", 4),        /* END WKLY-FREQ */
  (DEFAULT, 16, "Yes", 7, "YES answered to question of POSITIVE impact gives POSITIVE points"),                   /* BEGIN WKLY-BTN-+ */
  (DEFAULT, 16, "No", 0, "NO answered to question of POSITIVE impact is neutral; gives 0 points"),
  (DEFAULT, 17, "Yes", 0, "YES answered to question of NEGATIVE impact neutral; gives 0 points"),                 /* BEGIN WKLY-BTN-- */
  (DEFAULT, 17, "No", 7, "NO answered to question of NEGATIVE impact gives POSITIVE points");

CREATE TABLE question_categories (
  question_category_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(540) NOT NULL UNIQUE,
  category_display_name VARCHAR(540) NOT NULL UNIQUE,
  display_hex_code VARCHAR(10) DEFAULT NULL,
  UNIQUE INDEX `idx_category_name` (`category_name`)
);

INSERT INTO question_categories (
  question_category_id, category_name, category_display_name, display_hex_code
) VALUES 
  (DEFAULT, "dairy", "Dairy Foods", "#0821c0"),
  (DEFAULT, "fruits", "Fruits", "#f60b49"),
  (DEFAULT, "vegetables", "Vegetables", "#8ea315"),
  (DEFAULT, "meatx", "Meat, Fish & Eggs", "#f3c41f"),
  (DEFAULT, "starchx", "Breads, Cereal, Starches", "#84683c"),
  (DEFAULT, "bev", "Beverages", "#3ab2f6"),
  (DEFAULT, "sweet", "Sweets, Baked Goods, etc", "#502a5a"),
  (DEFAULT, "culi", "Culinary Ingredients", "#45bb49"),
  (DEFAULT, "profile", "User Info", NULL);

CREATE TABLE questions (
  question_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  question_text VARCHAR(540) NOT NULL UNIQUE,
  category_id int not null,
  field_type_id INT,
  field_code VARCHAR(15) NOT NULL,
  form_id INT NOT NULL,
  UNIQUE INDEX `idx_question_text` (`question_text`),
  FOREIGN KEY (field_type_id) REFERENCES question_field_types (field_type_id),
  FOREIGN KEY (category_id) REFERENCES question_categories (question_category_id),
  FOREIGN KEY (form_id) REFERENCES forms (form_id)
);

INSERT INTO questions (
  question_id, question_text, category_id, field_code, field_type_id, form_id
) VALUES 
    (DEFAULT, "How often did you drink a glass (8 oz) of skim or low fat milk?", 1, "skim-milk", 7, 1),
    (DEFAULT, "How often did you drink a glass (8 oz) of whole milk?", 1, "whole-milk", 7, 1),
    (DEFAULT, "How often did you eat a container (6 oz) of yoghurt or fermented milk?", 1, "yogurt", 7, 1),
    (DEFAULT, "How often did you eat 1 cup of ice cream?", 1, "ice-cream", 7, 1),
    (DEFAULT, "How often did you eat half a cup of fresh cheese? (NEED EXAMPLES)", 1, "fresh-cheese", 7, 1),
    (DEFAULT, "How often did you eat 2 slices of hard cheese? (NEED EXAMPLES)", 1, "hard-cheese", 7, 1),
    (DEFAULT, "How often did you eat a whole banana?", 2, "banana", 7, 1),
    (DEFAULT, "How often did you eat an orange, apple, pear or peach?", 2, "hand-fruits", 7, 1),
    (DEFAULT, "How often did you eat half a cup of strawberries, blueberries, or grapes?", 2, "berry", 7, 1),
    (DEFAULT, "How often did you eat half a cup of pineapple, cantaloupe, avocado, tangerine, apricot, or plum?", 2, "other-fruit", 7, 1),
    (DEFAULT, "How often did you drink a glass of (fresh) fruit juice?", 2, "juice", 7, 1),
    (DEFAULT, "How often did you eat (half of a tomato)?", 3, "tomato", 7, 1),
    (DEFAULT, "How often did you eat 1/2 cup of cooked string beans, broccoli, carrots, cabbage, cauliflower, or coleslaw?", 3, "beans", 7, 1),
    (DEFAULT, "How often did you eat 1/2 cup of (uncooked) spinach, lettuce, or leafy greens?", 3, "greens", 7, 1),
    (DEFAULT, "How often did you eat an ear of corn?", 3, "corn", 7, 1),
    (DEFAULT, "How often did you eat 1/2 cup of (cooked) squash, eggplant, or zucchini?", 3, "squash", 7, 1),
    (DEFAULT, "How often did you eat 1/2 cup of (cooked) beans, peas, lentils, or chickpeas?", 3, "lentil", 7, 1),
    (DEFAULT, "How often did you eat a 4 oz piece of chicken or turkey?", 4, "chicken", 7, 1),
    (DEFAULT, "How often did you eat a (piece of|unit|one) hamburger, hot dog, or sausage?", 4, "beef", 7, 1),
    (DEFAULT, "How often did you eat 2 slices of bacon?", 4, "bacon", 7, 1),
    (DEFAULT, "How often did you eat a 4 oz piece of pork, lamb, or beef steak?", 4, "red", 7, 1),
    (DEFAULT, "How often did you eat two slices of cold cuts?", 4, "cold-cut", 7, 1),
    (DEFAULT, "How often did you eat a (4 oz) can of tuna fish?", 4, "tuna", 7, 1),
    (DEFAULT, "How often did you eat a 4 oz fillet of cod, tilapia, pollock, halibut, catfish or flounder?", 4, "fish", 7, 1),
    (DEFAULT, "How often did you eat a 4 oz fillet of tuna steak, mackerel, salmon, sardine, or swordfish?", 4, "bluefish", 7, 1),
    (DEFAULT, "How often did you eat a single (hard boiled) egg?", 4, "egg", 7, 1),
    (DEFAULT, "How often did you eat 1 cup of cold breakfast cereal?", 5, "cereal", 7, 1),
    (DEFAULT, "How often did you eat a single slice of white bread?", 5, "white", 7, 1),
    (DEFAULT, "How often did you eat a single slice of dark or whole grain bread?", 5, "wheat", 7, 1),
    (DEFAULT, "How often did you eat a serving of 6 crackers (saltines, ritz, etc)?", 5, "cracker", 7, 1),
    (DEFAULT, "How often did you eat 2 slices of pizza?", 5, "pizza", 7, 1),
    (DEFAULT, "How often did you eat a tortilla (burrito, quesadila)?", 5, "tortilla", 7, 1),
    (DEFAULT, "How often did you eat one small bag of potato chips or corn chips?", 5, "chips", 7, 1),
    (DEFAULT, "How often did you eat (a serving) of french fries?", 5, "fries", 7, 1),
    (DEFAULT, "How often did you eat 1/2 cup of baked, boiled, or (mashed) potatoes?", 5, "potato", 7, 1),
    (DEFAULT, "How often did you eat a cup of white rice?", 5, "rice", 7, 1),
    (DEFAULT, "How often did you eat 1 cup of pasta?", 5, "pasta", 7, 1),
    (DEFAULT, "How often did you drink 8 oz of water?", 6, "water", 7, 1),
    (DEFAULT, "How often did you drink (8 oz) or coffee or (black) tea?", 6, "coffee", 7, 1),
    (DEFAULT, "How often did you drink a can or bottle of a carbonated beverage (EXAMPLES)", 6, "carbo", 7, 1),
    (DEFAULT, "How often did you drink a can or bottle of a low-calorie beverage (EXAMPLES)", 6, "low-cal", 7, 1),
    (DEFAULT, "How often did you drink a can or bottle of beer (EXAMPLES)", 6, "beer", 7, 1),
    (DEFAULT, "How often did you drink a glass of wine?", 6, "wine", 7, 1),
    (DEFAULT, "How often did you drink 1.5 oz of liquor?", 6, "liquor", 7, 1),
    (DEFAULT, "How often did you eat a bar of chocolate?", 7, "choc", 7, 1),
    (DEFAULT, "How often did you eat a doughnut, bagel, muffin, bread roll, pancake, waffle, cookie, a slice of cake or pie?", 7, "baked", 7, 1),
    (DEFAULT, "How often did you eat 1 tablespoon of peanut butter?", 7, "pb", 7, 1),
    (DEFAULT, "How often did you eat 1 piece of snack bars like Kind, Kashi, Clif, or Quest?", 7, "energy", 7, 1),
    (DEFAULT, "How often did you eat 1 small bag of doritos or pretzels?", 7, "snack", 7, 1),
    (DEFAULT, "How often did you eat (1 serving) of peanuts, walnuts, or other nuts?", 7, "nuts", 7, 1),
    (DEFAULT, "How often did you eat (1 package of candies)?", 7, "candy", 7, 1),
    (DEFAULT, "How often did you use 1 tablespoon of olive oil for cooking or dressing?", 8, "olive-oil", 7, 1),
    (DEFAULT, "How often did you use 1 tablespoon of vegetable oil for cooking or dressing?", 8, "veg-oil", 7, 1),
    (DEFAULT, "How often did you use 1 tablespoon of mayonnaise, italian or ranch salad dressing?", 8, "mayo", 7, 1),
    (DEFAULT, "How often did you use 1 tablespoon of butter or margarine for cooking or added to food or bread?", 8, "butter", 7, 1),
    (DEFAULT, "How often did you add salt to food at the table?", 8, "salt", 7, 1),
    (DEFAULT, "Please select your gender.", 9, "gender", 13, 1),
    (DEFAULT, "Please select your date of birth.", 9, "dob", null, 1),
    (DEFAULT, "Please select your country of origin.", 9, "origin", 6, 1),
    (DEFAULT, "Have you eaten at least 5 servings of fruit and vegetables at day? (1 serving = 103 g * 5= 515)", 3, "fv-5", 16, 2),
    (DEFAULT, "At least 3 servings of those F&V you ate at day were vegetables? (1 serving 89.2*3=268)", 3, "v-3", 16, 2),
    (DEFAULT, "Have you eaten less than 1/2 cup of patatoes at day?", 5, "pot", 16, 2),
    (DEFAULT, "Have you eaten 5 or less servings of cereals at day? (1 serving = 34.5 g of bread or 75.3 g of pasta/rice, 1 serving of cereals= 55g)", 5, "grn", 16, 2),
    (DEFAULT, "At least half of the servings of cereals you ate were whole grain?", 5, "wgrn", 16, 2),
    (DEFAULT, "Have you eaten 4 serving of legumes per week? (1 serving = 82.5 per day, 82.4 times 4= 330 per week= 47 g per day)", 3, "lgm", 16, 2),
    (DEFAULT, "Have you eaten 3 servings of nuts per week?  (1 serving = 30 g, 30 times 3 = 90 gramos per week, 13 g per day)", 7, "nut", 16, 2),
    (DEFAULT, "Have you eaten 3 servings of fish and seafood per week? (1 serving = 132 g, 132 times 3= 396 per week, 57 g per day)", 4, "fish", 16, 2),
    (DEFAULT, "Out of the servings of fish, were they mostly oily fish?", 4, "ofish", 16, 2),
    (DEFAULT, "Have you eaten 4 eggs per week? (1 egg=50 g, 50 times 4 = 200 per week, 29 g per day)", 4, "egg", 16, 2),
    (DEFAULT, "Have you eaten less than 2 servings of cheese, yogurt or fermented milk? (1 serving = 109 g of fresh cheese, 56 g hard cheese, 170 g of yogurt, 1 serving of dairy = 112 g, 112 times 2 = 224)", 1, "chs", 16, 2),
    (DEFAULT, "Have you eaten < of 3 serving of meat per week? (1 serving = 113.2 g, 113,2 times 3 = 340 per week, 49 per day)", 4, "meat", 16, 2),
    (DEFAULT, "Of those servings, were at least half of them white meat from poultry?", 4, "plt", 16, 2),
    (DEFAULT, "Have you eaten 1 serving of processed meat per week? (1 serving=42.8 g per week, 6 g per day)", 4, "prmeat", 16, 2),
    (DEFAULT, "Have you used olive oil for cooking and food dressing?", 8, "oo", 16, 2),
    (DEFAULT, "Have you eaten < of 1 serving of sweets, chocolates, cookies, industrial bakery, and snacks per week? (1 serving = 51,2 per week, 7 g per day)", 7, "sgr", 16, 2),
    (DEFAULT, "Have you added salt at table?", 8, "salt", 16, 2),
    (DEFAULT, "Did you drink 2 liter of water (8 glasses) per day? (8*237g= 1896 g (2litrs))", 6, "water", 16, 2),
    (DEFAULT, "Did you drink 1 glass of low-fat milk per day? (245 ml)", 1, "mlk", 16, 2),
    (DEFAULT, "Did you drink 1 cup of coffee or tea per day? (237 mL)", 6, "coff", 16, 2),
    (DEFAULT, "Did you drink 1 glass of whole-fat milk per day? (245 ml)", 1, "wmlk", 16, 2),
    (DEFAULT, "Did you drink 1 glass of fruit juice per day? (248 ml)", 6, "jui", 16, 2),
    (DEFAULT, "Did you drink 1 can of low calorie beverages per day? (370 mL)", 6, "lcal", 16, 2),
    (DEFAULT, "Did you drink 1 can of carbonated beverages per day? (370 mL)", 6, "carb", 16, 2),
    (DEFAULT, "Did you drink more than 1 alcoholic drink (if women) or more than 2 (if men) per day? (1 drink is 147 ml of wine, 356 ml of beer or 42 ml of liquors)", 6, "alc", 16, 2);

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