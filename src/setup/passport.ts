import * as Passport from 'passport';
import { Strategy } from 'passport-local';
import UserService from '../components/users/UserService';

export const setupPassportAuthentication = () => {
  Passport.use(
    new Strategy(
      {
        usernameField: 'email',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        const query: any = {
          email: email.toLowerCase(),
        };
        try {
          const foundUser = await UserService.findOne(query);
          if (!foundUser) {
            return done(null, null, {
              message: 'Invalid email or password.',
              code: 'invalid_login',
            });
          }

          return foundUser.comparePassword(password, (err, isMatch) => {
            if (err) {
              return done(err);
            }

            if (!isMatch) {
              return done(null, null, {
                message: 'Invalid email or password.',
                code: 'invalid_login',
              });
            }

            return done(null, foundUser, null);
          });
        } catch (err) {
          done(err);
        }
      }),
  );
};
