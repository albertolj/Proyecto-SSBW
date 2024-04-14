// app.js
import express from 'express'
import nunjucks from 'nunjucks'
import { PrismaClient } from '@prisma/client'

import * as dotenv from 'dotenv'
dotenv.config()

const IN   = process.env.IN            // 'development' or 'production'
const PORT = process.env.PORT
const prisma = new PrismaClient();


var app = express()
app.use(express.static('static'))


			
nunjucks.configure('views', {         // directorio 'views' para los templates html
	autoescape: true,
	noCache:    IN == 'development',
	watch:      IN == 'development',
	express: app
})
			
app.set('view engine', 'html')
						
app.get('/', (req, res) => {
	res.render('home.html')
})
			
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT} in ${IN} ...`)
})

// Ruta para obtener todos los usuarios que sean admin
app.get('/usuarios/admin', async (req, res) => {
    try {
        const adminUsers = await prisma.user.findMany({
            where: {
                admin: true
            }
        });
		res.render('usuariosAdmin.html', {users: adminUsers})
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios admin' });
    }
})

// Ruta para obtener usuarios por dominio de correo electrónico
app.get('/usuarios/con-email/de/:dominio', async (req, res) => {
    const dominio = req.params.dominio;
    try {
        const usersByDomain = await prisma.user.findMany({
            where: {
                email: {
                    endsWith: `.${dominio}`
                }
            }
        });
		res.render('usuarioConDominio.html', {users: usersByDomain, dominio: '.' + dominio})
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios por dominio de correo electrónico' });
    }
})

app.get('/workcation', async (req, res) => {
    try {
		res.render('workcation.html')
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar el workation' });
    }
})
// Ruta para manejar páginas no encontradas
app.use((req, res) => {
    res.status(404).render('paginaNoEncontrada.html')
});