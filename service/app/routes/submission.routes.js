const passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports = app => {
  const submissions = require("../controllers/submission.controller.js");

  var router = require("express").Router();

  const authenticateWebToken = function (req, res, next) {
    const authHeader = req.headers.authorization;

    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      
      console.log('token: ', token)
        jwt.verify(token, process.env.NODE_JWT_SECRET, (err, user) => {
            if (err) {
                console.log('jwt verify err: ', err)
                return res.sendStatus(403);
            } else if (new Date(user.exp) < Date.now()) {
                return res.sendStatus(403);
            } else {
                req.user = user;
                next();
            }
        });
    } else {
        res.sendStatus(401);
    }
  }

  router.post("/submit", passport.authenticate('jwt', { session: false }), submissions.submit);
  router.get("/", authenticateWebToken, submissions.getAll);

  app.use('/api/submissions', router);
};
