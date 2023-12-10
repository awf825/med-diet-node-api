const passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports = app => {
    const auth = require("../controllers/auth.controller.js");
    let router = require("express").Router();
  
    router.post("/register", auth.register);
    router.post("/login", auth.login);
    router.post("/googleLogin", auth.googleLogin);

    router.get(
        '/google',
        passport.authenticate('google', {
          scope: ['profile', 'email'],
        }),
    );

    router.get(
        '/google/callback',
        passport.authenticate('google', {
          failureRedirect: '/google',
          session: false,
        }),
        (req, res) => {
            res.redirect(
              `meddiet://app/login?userId=${req.user.userId}/email=${req.user.email}`
            );
        },
    );
  
    app.use('/api/auth', router);
};