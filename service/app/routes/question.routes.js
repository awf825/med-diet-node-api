const middleware = require('./middleware.js');

module.exports = app => {
    const questions = require("../controllers/question.controller.js");
    var router = require("express").Router();
  
    // router.get("/ffq", middleware.authenticateWebToken, questions.findAllFFQ);
    router.get("/ffq", questions.findAllFFQ);
    // router.get("/weekly", middleware.authenticateWebToken, questions.findAllWeekly);
    router.get("/weekly", questions.findAllWeekly);

    app.use('/api/questions', router);
  };
  