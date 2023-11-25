const passport = require('passport');

module.exports = app => {
    const questions = require("../controllers/question.controller.js");
    var router = require("express").Router();
  
    router.get("/", questions.findAll);

    app.use('/api/questions', router);
  };
  