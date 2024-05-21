const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')
const { secret } = require('./jwt.js')
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../dao/models/User.Model.js'); // Assuming you have a User model



// TODO: implementar extractor
const cookieExtractor = req => req && req.cookies ? req.cookies['accessToken'] : null

const githubOptions = {
    clientID: 'Iv1.e7a8bf52e3b29de4',
    clientSecret: '2d11104600b9fb8a818f321dda7c803c4d8eb83a',
    callbackURL: 'http://localhost:8080/api/sessions/github/callback', // Your GitHub callback URL
};

const initializeStrategy = () => {
    passport.use('jwt', new Strategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: secret
    }, async (jwtPayload, done) => {
        try {
            return done(null, jwtPayload.user)
        } catch (err) {
            done(err)
        }
    }))

    passport.use(new GitHubStrategy(githubOptions, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if the user exists in your database
            let user = await User.findOne({ githubId: profile.id });
            console.log("Github user:",user)
            if (!user) {
                // If the user doesn't exist, create a new one
                user = await User.create({ githubId: profile.id, username: profile.username });
            }
            // Pass the user to the done callback
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }));

    // Serialize user to store in session
    passport.serializeUser((user, done) => {
        done(null, user.id); // Assuming user has an 'id' property
    });

    // Deserialize user from session
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user); // Assuming you have a User model and using Mongoose
        });
    });
}

module.exports = initializeStrategy