// api.js 
import Fastify from 'fastify';
const fastify = Fastify({
  logger: true
});
import fastifyStatic from '@fastify/static';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'node:path';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static files
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public',
  index: false, 
  list: false
});

// Serve tabla.html at root
fastify.get('/', async (req, res) => {
  return res.type('text/html').sendFile('tabla.html');
});

// Register parent error handler
fastify.setErrorHandler((error, req, res) => {
  res.status(500).send({ ok: false, error });
});

import facturasRoute from './facturas.js';
fastify.register(facturasRoute, { prefix: '/api/facturas' });

// Run the server!
try {
  await fastify.listen({ port: 4000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
