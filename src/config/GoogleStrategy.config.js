const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const GoogleStrategyConfig = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorizationURL: process.env.GOOGLE_AUTH_URI,
        tokenURL: process.env.GOOGLE_TOKEN_URI,
        callbackURL: process.env.GOOGLE_REDIRECT_URI,
        passReqToCallback: true,
        scope: ["profile", "email"],
    },
    (req, accessToken, refreshToken, profile, done) => {
        req.accessToken = accessToken;
        req.refreshToken = refreshToken;
        req.profile = profile._json;
        return done(null, profile);
    }
);

passport.use(GoogleStrategyConfig);
// passport.serializeUser((user, done) => {
//     done(null, user);
// });
// passport.deserializeUser((user, done) => {
//     done(null, user);
// });

module.exports = GoogleStrategyConfig;
