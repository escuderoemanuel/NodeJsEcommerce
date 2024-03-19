// Atlas DB Connection
require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;

const passport = require('passport');
const local = require('passport-local');
const github = require('passport-github2');
const UserModel = require('../dao/models/user.model');
const { createHash, isValidPassword } = require('../utils');


const LocalStrategy = local.Strategy;
const GitHubStrategy = github.Strategy;


const initializePassport = () => {

  //? LOCAL STRATEGY

  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, async (req, username, password, done) => {

    const { firstName, lastName, email, age } = req.body;

    try {
      const user = await UserModel.findOne({ email: username });

      if (user) {
        return done(null, false, { message: 'The user is already registered.' });
      }

      const newUser = { firstName, lastName, email, age, password: createHash(password) };

      const result = await UserModel.create(newUser);
      return done(null, result);

    } catch (error) {
      return done(error);
    }
  }));


  passport.use('login', new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {

      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'User does not exist.' });
        }

        if (!isValidPassword(user, password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);

      } catch (error) {
        return done(error);
      }

    }))


  //? GITHUB STRATEGY

  passport.use('github', new GitHubStrategy({
    clientID: CLIENT_ID,
    callbackURL: CALLBACK_URL,
    clientSecret: CLIENT_SECRET,
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {

      const user = await UserModel.findOne({ email: profile._json.email })
      if (!user) {
        const newUser = {
          firstName: profile._json.name,
          lastName: '',
          age: 37,
          email: profile._json.email,
          password: '',
          role: 'user',

        }
        const result = await UserModel.create(newUser)
        return done(null, result)
      } else {
        return done(null, user)
      }

    } catch (error) {
      return done('ERROR:', error)
    }

  }))
}

passport.serializeUser((user, done) => {
  return done(null, user._id);
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findOne({ _id: id });
    return done(null, user)
  } catch (error) {
    return done(error)
  }
})

module.exports = initializePassport;