const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require('../dao/models/User.Model');

const initializePassport = () => {
    passport.use(new GitHubStrategy({
        clientID: "Iv1.e7a8bf52e3b29de4",
        clientSecret: "2d11104600b9fb8a818f321dda7c803c4d8eb83a",
        callbackURL: "http://localhost:8080/api/sessions/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        // Check if the user exists in your database
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
            // If the user doesn't exist, create a new one
            user = await User.create({ githubId: profile.id, username: profile.username });
        }
        // Pass the user object to the done callback
        done(null, user);
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });


};

module.exports = initializePassport;
