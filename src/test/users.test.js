import mongoose from "mongoose";
import { expect } from "chai";
import supertest from "supertest";

import sessionRoutes from "../routes/session.routes.js";
import { usersMongoose } from "../dao/users/user.mongoose.js";

const request = supertest(sessionRoutes);

describe('Testing sessionRoutes', () => {
    let userDao;

    before(async function () {
        await mongoose.connect('mongodb+srv://ezequielleivacecchi:hALl0CgkEToU97kJ@testingcoder.hb2y0h9.mongodb.net/test');
        userDao = new usersMongoose();
    });

    afterEach(async function () {
        await mongoose.connection.collections.users.drop();
    });

    after(async function () {
        await mongoose.connection.close();
    });

    it('Debe permitir el registro de un nuevo usuario', async function () {
        const userData = {
            first_name: 'Ezequiel',
            last_name: 'Leiva Cecchi',
            email: 'ezequielleivacecchi@gmail.com',
            password: '123'
        };
        const response = await request
        .post('/register')
        .send(userData)
        .expect('Content-Type', /json/)
        // const res = await request.post('/register').send(userData);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message').to.equal('User registered successfully');
    });
    it('Debe permitir el registro de un nuevo usuario', async function () {
        console.log("Iniciando prueba de registro de usuario...");

        const userData = {
            first_name: 'Ezequiel',
            last_name: 'Leiva Cecchi',
            email: 'ezequielleivacecchi@gmail.com',
            password: '123'
        };

        console.log("Enviando solicitud de registro...");
        const res = await request.post('/register').send(userData);
        console.log("Respuesta recibida:", res.body);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message').to.equal('User registered successfully');

        console.log("Prueba de registro de usuario completada.");
    });
    
    it('Debe permitir el cierre de sesión de un usuario autenticado', async function () {
        const authenticatedUser = {
            first_name: 'Ezequiel',
            last_name: 'Leiva Cecchi',
            email: 'ezequielleivacecchi@gmail.com',
            password: '123'
        };
        await userDao.addUsers(authenticatedUser);
        await request.post('/login').send(authenticatedUser);
    
        const res = await request.post('/logout');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message').to.equal('User logged out successfully');
    });
});
