// https://www.bezkoder.com/docker-compose-nodejs-mysql/
require("dotenv").config();

// preparing these statements to deploy a dummy to GCP App Engine
if (process.env.MYSQLDB_ROOT_PASSWORD) {
  const db = require("./app/models");
  db.sequelize.sync();
}

const express = require("express");
const cors = require("cors");
const app = express();
var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.GOOGLE_CLIENT_ID) {
  const passport = require('passport');
  require('./app/config/passport.config.js')(passport);
  app.use(passport.initialize());
}

// simple route
app.get("/", (req, res) => { res.json({ status: "GOO" } ); });
require("./app/routes/user.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/question.routes")(app);
require("./app/routes/submission.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
