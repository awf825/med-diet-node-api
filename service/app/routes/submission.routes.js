const passport = require('passport');

module.exports = app => {
  const submissions = require("../controllers/submission.controller.js");

  var router = require("express").Router();

  router.post("/submit", passport.authenticate('jwt', { session: false }), submissions.submit);
  router.get("/", passport.authenticate('jwt', { session: false }), submissions.getAll);

  app.use('/api/submissions', router);
};
