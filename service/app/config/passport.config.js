const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
 
const db = require("../models");
const User = db.user;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.NODE_JWT_SECRET,
  ignoreExpiration: true // means to an end here? only validate with google, microsoft, apple?
};
 
module.exports = passport => {
  passport.use(
    new JwtStrategy(
        opts,
        async (jwt_payload, done) => {
            if (jwt_payload) {
                const user = await User.findOne({
                    where: {
                        username: jwt_payload?.username
                    }
                })
     
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } else {
                console.log('token expired')
                return done(null, false)
            }
        }
    )
  );
};