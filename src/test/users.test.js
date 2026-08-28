import { expect } from 'chai';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { requireAdminAuth, requireUserAuth } from '../middlewares/authMiddleware.js';

describe('Seguridad de autenticación', () => {
    it('valida una contraseña hasheada y rechaza una incorrecta', () => {
        const user = { password: createHash('clave-segura') };
        expect(isValidPassword(user, 'clave-segura')).to.equal(true);
        expect(isValidPassword(user, 'otra-clave')).to.equal(false);
    });

    it('bloquea rutas de administrador para usuarios comunes', () => {
        const req = { session: { user: { isAdmin: 'User' } } };
        let statusCode;
        let payload;
        const res = {
            status(code) { statusCode = code; return this; },
            json(body) { payload = body; return this; }
        };
        let nextCalled = false;
        requireAdminAuth(req, res, () => { nextCalled = true; });
        expect(statusCode).to.equal(403);
        expect(payload).to.have.property('error');
        expect(nextCalled).to.equal(false);
    });

    it('permite rutas de administrador al rol Admin', () => {
        const req = { session: { user: { isAdmin: 'Admin' } } };
        const res = {};
        let nextCalled = false;
        requireAdminAuth(req, res, () => { nextCalled = true; });
        expect(nextCalled).to.equal(true);
    });

    it('requiere sesión para operaciones de carrito', () => {
        const req = { session: {} };
        let statusCode;
        const res = {
            status(code) { statusCode = code; return this; },
            json() { return this; }
        };
        let nextCalled = false;
        requireUserAuth(req, res, () => { nextCalled = true; });
        expect(statusCode).to.equal(401);
        expect(nextCalled).to.equal(false);
    });
});
