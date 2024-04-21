const middleware = require('./middleware.js');

module.exports = app => {
  const submissions = require("../controllers/submission.controller.js");

  var router = require("express").Router();

  router.post("/submit", middleware.authenticateWebToken, submissions.submit);
  // router.post("/submit", submissions.submit);
  // router.get("/", middleware.authenticateWebToken, submissions.getAll);
  router.get("/", submissions.getAll);

  router.get("/getAnswersByCategory", middleware.authenticateWebToken, submissions.getAnswersByCategory);

  app.use('/api/submissions', router);
};
