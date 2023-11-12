// https://www.bezkoder.com/docker-compose-nodejs-mysql/
// require("dotenv").config({ path: "../.env" });
require("dotenv").config();
// const passport = require('passport');
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;

const db = require("./app/models");
db.sequelize.sync();

const express = require("express");
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const passport = require('passport');
require('./app/config/passport.config.js')(passport);

// const jwtOptions = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.NODE_JWT_SECRET
// };

// const strategy = new JwtStrategy(jwtOptions, function (payload, done) {
//     (payload, done) => {
//         //const user = users.find(u => u.username === jwt_payload.username);

//         const user = db.users.findOne({
//             where: {
//                 username: payload.username
//             }
//         })
        
//         if (user) {
//             return done(null, user);
//         }

//         return done(null, false);
//       } 
// });

// passport.use(strategy);
app.use(passport.initialize());

// simple route
app.get("/", (req, res) => {
  res.json(
    { 
      message: "Welcome Joe."
      // db: db
    }
  );
});

require("./app/routes/turorial.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/auth.routes")(app);

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
