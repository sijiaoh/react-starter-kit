/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Passport.js reference implementation.
 * The database schema used in this sample is available at
 * https://github.com/membership/membership.db/tree/master/postgres
 */

import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import config from './config';
import sequelize from './data/sequelize';

const { User, UserLogin, UserClaim, UserProfile } = require('./data/models');

async function login(req, loginName, profile, claims, done) {
  const userLogin = await UserLogin.findOne({
    where: { name: loginName, key: profile.id },
  });

  // User is signed in.
  if (req.user) {
    if (req.user.id !== userLogin.userId) {
      done(new Error('User is not a UserLogin user.'));
      return;
    }

    // Already logged in with this UserLogin.
    if (userLogin) done(null);
    else {
      // Add oauth association to user.
      await sequelize
        .transaction(transaction => {
          const promise = UserLogin.create(
            { name: loginName, key: profile.id, userId: req.user.id },
            { transaction },
          );

          claims.forEach(claim =>
            promise.then(() =>
              UserClaim.create(
                { ...claim, userId: req.user.id },
                { transaction },
              ),
            ),
          );

          return promise;
        })
        .then(() => done(null))
        .catch(err => done(err));
    }
  }
  // User is not signed in.
  else {
    // Already has an account.
    // eslint-disable-next-line no-lonely-if
    if (userLogin) done(null, { id: userLogin.userId });
    else {
      // Create an account.
      const user = await User.create(
        {
          uid: profile.id,
          logins: [{ name: loginName, key: profile.id }],
          claims,
          profile: {
            displayName: profile.displayName,
          },
        },
        {
          include: [
            { model: UserLogin, as: 'logins' },
            { model: UserClaim, as: 'claims' },
            { model: UserProfile, as: 'profile' },
          ],
        },
      );

      done(null, {
        id: user.id,
      });
    }
  }
}

/**
 * Sign in with Facebook.
 */
passport.use(
  new FacebookStrategy(
    {
      clientID: config.auth.facebook.id,
      clientSecret: config.auth.facebook.secret,
      callbackURL: '/login/facebook/return',
      profileFields: ['displayName'],
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      const loginName = 'facebook';
      const claimType = 'urn:facebook:access_token';
      const claims = [{ type: claimType, key: accessToken }];

      login(req, loginName, profile, claims, done).catch(done);
    },
  ),
);

/**
 * Sign in with Google.
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: config.auth.google.id,
      clientSecret: config.auth.google.secret,
      callbackURL: '/login/google/return',
      profileFields: ['displayName'],
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      const loginName = 'google';
      const claimType = 'urn:google:access_token';
      const claims = [{ type: claimType, key: accessToken }];

      login(req, loginName, profile, claims, done).catch(done);
    },
  ),
);

export default passport;
