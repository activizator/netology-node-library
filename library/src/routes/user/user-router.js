const express = require('express');
const router = express.Router();
const multer = require('multer');
const formParser = multer();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { UserSchema } = require('../../models');

/**
 * @param {String} userlogin
 * @param {String} password
 * @param {Function} done
 */
async function verify (userlogin, password, done) {
    try {
        const user = await UserSchema.findOne({ userlogin });
        if (!user) { return done(null, false); }
        if (user.password !== password) { return done(null, false); }
        return done(null, user);
    } catch (e) {
        return done(e);
    }
}

const options = {
    usernameField: 'userlogin',
    passwordField: 'password',
    passReqToCallback: false
};
//  Добавление стратегии для использования
passport.use('local', new LocalStrategy(options, verify));

// Конфигурирование Passport для сохранения пользователя в сессии
passport.serializeUser(function (user, cb) {
    cb(null, user._id);
});

passport.deserializeUser(async function (_id, cb) {
    try {
        const user = await UserSchema.findById(_id);
        cb(null, user);
    } catch (e) {
        return cb(e);
    }
});

router.get('/user/login', (req, res) => {
    res.render('user/login', {
        title: 'Login / Sign Up'
    });
});

router.get('/user/logout', function (req, res) {
    req.logout();
    res.redirect('/api/user/me');
});

router.get('/user/me', (req, res) => {
    res.render('user/me', { user: req.user });
});

router.post('/user/login', formParser.single('body'), passport.authenticate('local', { failureRedirect: '/api/user/login' }), (req, res) => {
    console.log('req.user: ', req.user);
    res.redirect('/api/user/me');
});

router.post('/user/signup', formParser.single('body'), async (req, res) => {
    const { userlogin, password, username, email } = req.body;
    // в учебных целях храним пароль в открытом виде )
    const newUser = new UserSchema({ userlogin, password, username, email });
    try {
        await newUser.save();
        res.redirect('/api/user/login');
    } catch (e) {
        console.error(e);
        res.redirect('/api/user/login');
    }
});

module.exports = router;
