module.exports = app => {
  const submissions = require("../controllers/submission.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/submit", submissions.submit);

  app.use('/api/submissions', router);
};
