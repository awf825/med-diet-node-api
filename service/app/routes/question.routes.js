const middleware = require('./middleware.js');

module.exports = app => {
    const questions = require("../controllers/question.controller.js");
    var router = require("express").Router();
  
    router.get("/", middleware.authenticateWebToken, questions.findAll);

    app.use('/api/questions', router);
  };
  