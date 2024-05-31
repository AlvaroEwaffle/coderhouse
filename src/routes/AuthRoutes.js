const { Router } = require('express');
const passport = require('passport');
const AuthService = require('../services/AuthService');

const router = Router();

router.post('/login', AuthService.login);
router.post('/register', AuthService.register);
router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), AuthService.githubCallback);
router.get('/current', passport.authenticate('jwt', { session: false }), AuthService.getCurrentUser);
router.get('/logout', AuthService.logout);

module.exports = router;
