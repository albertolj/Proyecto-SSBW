// auth.js
import express from 'express';
import passport from 'passport';

const router = express.Router();

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
    const username = req.isAuthenticated() ? req.session.passport.user.username : null; // Obtener el username
    const error = req.flash('error')[0];
    res.render('login.html', { username,error }); // Pasar el username a la plantilla
});

// Ruta para manejar el inicio de sesión
//router.post('/login', passport.authenticate('local', {
//    successRedirect: '/', // Redirigir a la página de facturación si la autenticación es exitosa
//    failureRedirect: '/auth/login', // Redirigir al formulario de inicio de sesión si hay un error
//    failureFlash: true
//}));

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            req.flash('error', '¡Nombre de usuario o contraseña incorrectos! Por favor, inténtelo de nuevo.');
            return res.redirect('/auth/login');
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Resto de las rutas de autenticación...

export default router;