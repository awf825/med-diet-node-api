const passport = require('passport');
const middleware = require('./middleware.js');

module.exports = app => {
  const submissions = require("../controllers/submission.controller.js");

  var router = require("express").Router();

  router.post("/submit", middleware.authenticateWebToken, submissions.submit);
  router.get("/", middleware.authenticateWebToken, submissions.getAll);

  app.use('/api/submissions', router);
};
