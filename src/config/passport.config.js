import passport from "passport";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';

import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { usersDAO } from "../dao/users/indexUsers.js";

const localStrategy = LocalStrategy;

const initializePassport = () => {
    // Estrategia de registro
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            try {
                const existingUser = await usersDAO.findUserByEmail(email);
                if (existingUser) {
                    return done(null, false, { message: 'El correo electrónico ya está en uso' });
                }

                if (!password || password.length < 6) {
                    return done(null, false, { message: 'La contraseña debe tener al menos 6 caracteres' });
                }

                const newUser = { email, password }; // Ajusta según tu lógica de creación de usuario
                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Estrategia de inicio de sesión
    passport.use('login', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await usersDAO.findUserByEmail(email);
                if (!user || !(await bcrypt.compare(password, user.password))) {
                    return done(null, false, { message: 'Correo electrónico o contraseña incorrectos' });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('github', new GithubStrategy(
        {
            clientID: 'Iv1.967e1f2adf04d46b',
            clientSecret: '57fc8f2c426e76a4f73e2ab6ecdc082b68cd5f54',
            callbackURL: 'http://localhost:8080/api/session/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log('GitHub Profile:', profile); 
                const user = await usersDAO.findUserByEmail({ email: profile._json.email });
                if (user) {
                    return done(null, user); 
                }
                const newUser = await usersDAO.createUser({ 
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email || profile.username, 
                    password: 'CreateWithGithub', 
                });
                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    ));
    // Serializa el usuario en la sesión
    passport.serializeUser((user, done) => {
        done(null, user.email);
    });

    // Deserializa el usuario de la sesión
    passport.deserializeUser(async (email, done) => {
        try {
            const user = await usersDAO.findUserByEmail(email);
            if (!user) {
                return done(new Error('Usuario no encontrado'));
            }
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export default initializePassport;
