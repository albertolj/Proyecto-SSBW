// app.js
import express from 'express'
import nunjucks from 'nunjucks'
import { PrismaClient } from '@prisma/client'
import bodyParser from 'body-parser';

import * as dotenv from 'dotenv'
import winston from 'winston'

const { combine, timestamp, printf, colorize, align} = winston.format;
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

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'debug',
	format: combine(
		colorize({ all: true }),
		timestamp({
			format: 'YYYY-MM-DD hh:mm:ss',
		}),
		align(),
		printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: 'app.log',
			level: 'info',
		}),		
	],
});


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

// Ruta para mostrar el formulario de facturación
app.get('/facturacion', (req, res) => {
    logger.error('error');
    logger.warn('warn');
    logger.info('info');
    logger.verbose('verbose');
    logger.debug('debug');
    logger.silly('silly');
    res.render('facturacion.html');
});

// Ruta para procesar el formulario de facturación
app.post('/facturacion', async (req, res) => {
    try {
        const { client, date, concept, quantity, price } = req.body;

        // Convertir la cadena de fecha en un objeto de fecha JavaScript
        const formattedDate = new Date(date);

        // Guardar la factura en la base de datos
        const factura = await prisma.factura.create({
            data: {
                client,
                date: formattedDate,
                concept,
                cuantity: parseFloat(quantity),
                price: parseFloat(price),
                total: parseFloat(quantity) * parseFloat(price)
            }
        });

        res.status(200).render('success.html');
    } catch (error) {
        console.error('Error al procesar la factura:', error);
        res.status(500).json({ success: false, message: 'Error al procesar la factura' });
    }
});


// Ruta para manejar páginas no encontradas
app.use((req, res) => {
    res.status(404).render('paginaNoEncontrada.html')
});