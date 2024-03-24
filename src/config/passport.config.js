// Atlas DB Connection
require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;

const passport = require('passport');
const local = require('passport-local');
const github = require('passport-github2');
const { createHash, isValidPassword } = require('../utils');

const UsersDbManager = require('../dao/dbManager/UsersDbManager');
const UserManager = new UsersDbManager();

const LocalStrategy = local.Strategy;
const GitHubStrategy = github.Strategy;

const initializePassport = () => {

  //! JWT STRATEGY
  // Register
  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    session: false
  }, async (req, email, password, done) => {

    try {
      const { firstName, lastName, email, age } = req.body;
      if (!firstName || !lastName || !email || !age || !password) {
        return done(null, false, { message: 'All fields are required.' });
      }

      const existingUser = await UserManager.getByEmail({ email });
      if (existingUser) {
        return done(null, false, { message: 'The user is already registered.' });
      }

      const newUser = { firstName, lastName, email, age, password: createHash(password) };

      const result = await UserManager.createUser(newUser);
      done(null, result);

    } catch (error) {
      done(error);
    }
  }));

  // Register
  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    session: false
  },
    async (email, password, done) => {
      try {
        // Admin Logic
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
          return done(null, {
            firstName: 'User',
            email: 'adminCoder@coder.com',
            role: 'admin' // Asigna el rol de 'admin' si coincide
          })
        }
        const user = await UserManager.getByEmail({ email });
        if (!user) {
          return done(null, false, { message: 'User does not exist.' });
        }

        if (!isValidPassword(user, password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }))

  //! GITHUB STRATEGY
  passport.use('github', new GitHubStrategy({
    clientID: CLIENT_ID,
    callbackURL: CALLBACK_URL,
    clientSecret: CLIENT_SECRET,
    session: false
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      // console.log('profile', profile)
      const user = await UserManager.getByEmail({ email: profile._json.email })
      if (!user) {
        const newUser = {
          firstName: profile._json.name,
          lastName: '',
          age: 18,
          email: profile._json.email,
          password: '',
          role: 'user',
        }
        const result = await UserManager.createUser(newUser)
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
    const user = await UserManager.getById({ _id: id });
    return done(null, user)
  } catch (error) {
    return done('ERROR:', error)
  }
})

module.exports = initializePassport;