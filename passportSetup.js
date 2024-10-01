import GoogleStrategy from "passport-google-oauth20";
import { userModel } from "./model/userModel.js";
import passport from "passport";

// Register a Strategy to be passed when authenticate () method is called
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      passReqToCallback: true,
      scope: ["profile", "email"],
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        let data = profile?._json;
        let user = await userModel.findOne({ email: data.email });

        if (!user) {
          const newUser = await userModel.create({
            firstname: data.given_name,
            lastname: data.family_name,
            profilePicture: data.picture,
            email: data.email,
            isVerified: true,
          });
          return await done(null, newUser);
        }
        return await done(null, user);
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
