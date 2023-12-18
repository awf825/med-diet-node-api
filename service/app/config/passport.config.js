const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
 
const db = require("../models");
const User = db.user;
const bcrypt = require('bcryptjs');

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
            const existingUser = await User.findOne({
              where: {
                email: profile.email
              }
            })

            if (existingUser) {
              console.log('LOGGING IN')
              const passwordMatch = await bcrypt.compare(profile.id, existingUser.password);
  
              if (passwordMatch) {
                return done(null, {
                  userId: existingUser.user_id,
                  email: existingUser.email
                })
              } else {
                return done(null, false);
              }
            } else {
              console.log('CREATING USER')
              const hashedPassword = await bcrypt.hash(profile.id, 10);
              const newUser = await User.create({
                email: profile.email,
                auth_method_id: 2,
                first_name: profile.given_name,
                last_name: profile.family_name,
                google_user_id: profile.id,
                google_profile_picture_url: profile.picture,
                password: hashedPassword
              })

              return done(null, {
                userId: newUser.user_id,
                email: newUser.email
              })

            }
          },
    )
  )
};