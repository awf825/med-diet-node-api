const middleware = require('./middleware.js');

module.exports = app => {
  const submissions = require("../controllers/submission.controller.js");

  var router = require("express").Router();

  router.post("/submit", middleware.authenticateWebToken, submissions.submit);
  // router.post("/submit", submissions.submit);
  // router.get("/", middleware.authenticateWebToken, submissions.getAll);
  router.get("/", submissions.getAll);

  // router.get("/getAnswersByCategory", middleware.authenticateWebToken, submissions.getAnswersByCategory);
  router.get("/getAnswersByCategory", submissions.getAnswersByCategory);

  /* GET TIME OF COMPLETION AND SCORE OF LATEST SUBMISSION */
  // router.get("/getLatestSubmissionAndStreaks", middleware.authenticateWebToken, submissions.getLatestSubmissionAndStreaks);
  router.get("/getLatestSubmissionAndStreaks", submissions.getLatestSubmissionAndStreaks);

  app.use('/api/submissions', router);
};
