const getSessionUser = (req) => req.session?.user || req.user || null;

const respondUnauthenticated = (req, res) => {
    if (req.accepts?.('html')) {
        return res.redirect('/login');
    }
    return res.status(401).json({ error: 'Authentication required' });
};

export const requireAuth = (req, res, next) => {
    if (!getSessionUser(req)) {
        return respondUnauthenticated(req, res);
    }
    return next();
};

export const checkExistingUser = (req, res, next) => {
    if (getSessionUser(req)) {
        return res.redirect('/');
    }
    return next();
};

export const requireAdminAuth = (req, res, next) => {
    const user = getSessionUser(req);
    if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    if (user.isAdmin !== 'Admin') {
        return res.status(403).json({ error: 'Forbidden. Admin access required.' });
    }
    return next();
};

export const requireUserAuth = (req, res, next) => {
    const user = getSessionUser(req);
    if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    if (!['User', 'Admin'].includes(user.isAdmin)) {
        return res.status(403).json({ error: 'Forbidden. User access required.' });
    }
    return next();
};
