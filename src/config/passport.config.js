const { GITHUB_CLIENT_ID, GITHUB_CALLBACK_URL, GITHUB_CLIENT_SECRET } = require('../config/environment.config');
const passport = require('passport');
const local = require('passport-local');
const github = require('passport-github2');
const { createHash, isValidPassword } = require('../utils/utils');
const { cartsService, usersService } = require('../repositories');
const UserModel = require('../dao/models/user.model');

const LocalStrategy = local.Strategy;
const GitHubStrategy = github.Strategy;

const initializePassport = () => {

  //? JWT STRATEGY
  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    session: false
  }, async (req, email, password, done) => {

    let existingUser;
    existingUser = await usersService.getByEmail(email);

    try {
      const { firstName, lastName, email, password, age } = req.body;
      if (!firstName || !lastName || !email || !password || !age) {
        return done(null, false, { message: 'All fields are required.' });
      }

      if (existingUser) {
        return done(null, false, { message: 'The user is already registered.' });
      }

      const cart = await cartsService.create();
      const newUserData = { firstName, lastName, email, age, password: createHash(password), cart: cart._id };
      let result = await usersService.create(newUserData);
      return done(null, result);
    } catch (error) {
      done(error);
    }
  }));


  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    session: false
  },
    async (email, password, done) => {
      try {

        const user = await usersService.getByEmail(email);
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


  //? GITHUB STRATEGY
  passport.use('github', new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    callbackURL: GITHUB_CALLBACK_URL,
    clientSecret: GITHUB_CLIENT_SECRET,
    session: false
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      const user = await usersService.getByEmail(profile._json.email)
      const firstName = profile._json.name.split(' ')[0];
      const lastName = profile._json.name.split(' ')[1];
      if (!user) {
        const cart = await cartsService.create();
        const newUserData = {
          firstName: firstName,
          lastName: lastName,
          email: profile._json.email,
          password: '****',
          role: 'user',
          cart: cart._id
        }
        const result = await usersService.create(newUserData)
        return done(null, result)
      } else {
        return done(null, user)
      }
    } catch (error) {
      done(error)
    }
  }))
}

passport.serializeUser((user, done) => {
  return done(null, user._id);
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findOne({ _id: id });
    done(null, user)
  } catch (error) {
    done(error)
  }
})

module.exports = initializePassport;