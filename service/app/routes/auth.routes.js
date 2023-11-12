const passport = require('passport');

module.exports = app => {
    const auth = require("../controllers/auth.controller.js");
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/register", auth.register);
    router.post("/login", auth.login);

    // router.get('/protected', () => passport.authenticate('jwt', { session: false }), (req, res) => {
    //         res.send('You have accessed a protected route!');
    //     }
    // );
  
    app.use('/api/auth', router);
};