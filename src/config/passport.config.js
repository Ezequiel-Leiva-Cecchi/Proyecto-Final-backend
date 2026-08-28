import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';

import { usersDAO } from '../dao/users/indexUsers.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (_req, email, password, done) => {
            try {
                const existingUser = await usersDAO.findUserByEmail(email);
                if (existingUser) {
                    return done(null, false, { message: 'El correo electrónico ya está en uso' });
                }
                if (!password || password.length < 6) {
                    return done(null, false, { message: 'La contraseña debe tener al menos 6 caracteres' });
                }
                return done(null, { email });
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('login', new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' },
        async (email, password, done) => {
            try {
                const user = await usersDAO.findUserByEmail(email);
                if (!user || !isValidPassword(user, password)) {
                    return done(null, false, { message: 'Correo electrónico o contraseña incorrectos' });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    const clientID = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (clientID && clientSecret) {
        passport.use('github', new GithubStrategy(
            {
                clientID,
                clientSecret,
                callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:8080/api/session/githubcallback'
            },
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    const email = profile.emails?.[0]?.value || profile._json?.email || `${profile.username}@github.local`;
                    let user = await usersDAO.findUserByEmail(email);
                    if (!user) {
                        user = await usersDAO.createUser({
                            first_name: profile.displayName || profile.username || 'GitHub',
                            last_name: 'User',
                            email,
                            password: createHash(`github-${profile.id}-${Date.now()}`),
                            isAdmin: 'User'
                        });
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        ));
    }

    passport.serializeUser((user, done) => {
        done(null, user.email);
    });

    passport.deserializeUser(async (email, done) => {
        try {
            const user = await usersDAO.findUserByEmail(email);
            return done(null, user || false);
        } catch (error) {
            return done(error);
        }
    });
};

export default initializePassport;
