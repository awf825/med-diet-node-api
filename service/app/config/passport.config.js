const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
 
const db = require("../models");
const User = db.user;
const jwt = require('jsonwebtoken');

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

  passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `http://localhost:8080/api/auth/google/callback`
          },
          async (accessToken, refreshToken, profile, done) => {
            console.log('=== BEGIN GOOGLE STRATEGY ===')
            console.log('accessToken: ', accessToken)
            console.log('refreshToken: ', refreshToken);
            console.log('profile: ', profile);
            console.log('=== END GOOGLE STRATEGY ===')
            //sequelize query for user
                // if found, continue with -> return done(null, existingUser);
            // otherwise create newUser and -> return done(null, newUser)

            // TOKEN SEND UP HERE!!!
            return done(
              null,
              {
                username: 'awf825',
                userId: 1
              }
            )


            // console.log(profile);
            // try {
            //   const oldUser = await User.findOne({ email: profile.email });
        
            //   if (oldUser) {
            //     return done(null, oldUser);
            //   }
            // } catch (err) {
            //   console.log(err);
            // }
          },
    )
  )
};