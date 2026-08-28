import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import handlebars from 'express-handlebars';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

import sessionRoutes from './routes/session.routes.js';
import viewsRoutes from './routes/views.routes.js';
import initializePassport from './config/passport.config.js';
import productRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';
import passwordResetRouter from './routes/passwordReset.routes.js';
import { swaggerConfiguration } from './utils/swagger-config.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 8080;
const MONGODB_URL = process.env.MONGODB_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!MONGODB_URL || !SESSION_SECRET) {
    throw new Error('Faltan MONGODB_URL o SESSION_SECRET. Revisá el archivo .env.');
}

const app = express();

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: SESSION_SECRET,
    store: MongoStore.create({ mongoUrl: MONGODB_URL }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 8
    }
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.session?.user || null;
    next();
});

const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        eq: (left, right) => left === right,
        multiply: (left, right) => Number(left || 0) * Number(right || 0),
        formatPrice: (value) => new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(Number(value || 0))
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

const specs = swaggerJSDoc(swaggerConfiguration);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs, {
    customSiteTitle: 'Nexo Store API'
}));

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'nexo-store' });
});

app.use('/api/session', sessionRoutes);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/password-reset', passwordResetRouter);
app.use('/', viewsRoutes);

app.use((req, res) => {
    if (req.accepts('html')) {
        return res.status(404).send('<h1>404</h1><p>La página que buscás no existe.</p>');
    }
    return res.status(404).json({ error: 'Not found' });
});

app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
});

mongoose.connect(MONGODB_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Nexo Store escuchando en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('No se pudo conectar a MongoDB:', error.message);
        process.exitCode = 1;
    });
