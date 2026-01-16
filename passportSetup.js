import GoogleStrategy from "passport-google-oauth20";
import { userModel } from "./model/userModel.js";
import passport from "passport";
import { LoginAgents } from "./enums/LoginAgents.js";

// Register a Strategy to be passed when authenticate () method is called
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/api/v1/auth/google/callback',
      passReqToCallback: true,
      scope: ["profile", "email"],
    },
     async function (request, accessToken, refreshToken, profile, done) {
      try {  
        let data = profile && profile._json; 
        let user = await userModel.findOne({ email: data.email });
        
        if (!user) {
          const newUser = await userModel.create({
            firstName: data.given_name,
            lastName: data.family_name,
            profilePicture: data.picture,
            email: data.email,
            loginAgent: LoginAgents.GOOGLE,
            isVerified: true,
          });
          await newUser.save()
          return await done(null, profile);
        }
        return await done(null, data);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
