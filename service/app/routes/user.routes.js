const middleware = require('./middleware.js');

module.exports = app => {
    const users = require("../controllers/user.controller.js");
    var router = require("express").Router();
  
    router.get("/", users.findAll);
    router.post("/updateUserInfo", middleware.authenticateWebToken, users.updateUserInfo);

    app.use('/api/users', router);
  };
  