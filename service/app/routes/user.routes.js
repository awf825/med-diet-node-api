module.exports = app => {
    const users = require("../controllers/user.controller.js");
    var router = require("express").Router();
  
    router.get("/", users.findAll);

    app.use('/api/users', router);
  };
  