module.exports = app => {
  const submissions = require("../controllers/submission.controller.js");

  var router = require("express").Router();

  router.post("/submit", submissions.submit);
  router.get("/", submissions.getAll);

  app.use('/api/submissions', router);
};
