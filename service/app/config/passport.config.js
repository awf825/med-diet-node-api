const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
 
const db = require("../models");
const User = db.users;

// const opts = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.NODE_JWT_SECRET
// };
 
module.exports = passport => {
  passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.NODE_JWT_SECRET
        },
        async (jwt_payload, done) => {
            console.log('jwt_payload: ', jwt_payload)
            //const user = users.find(u => u.username === jwt_payload.username);
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
                return done(null, false)
            }
        }
    )
  );
};