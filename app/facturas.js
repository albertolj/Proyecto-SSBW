import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function facturaRoutes(app, options) {

  // Obtener todas las facturas
  app.get('/', async (request, reply) => {
    try {
      const facturas = await prisma.factura.findMany();
      reply.send({ data: facturas });
    } catch (error) {
      reply.code(500).send({ error: 'Error interno del servidor' });
    }
  });

  // Ruta para obtener una factura por ID
  app.get('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      const factura = await prisma.factura.findUnique({
        where: { id: Number(id) },
      });

      if (factura) {
        reply.send({ factura });
      } else {
        reply.code(404).send({ error: `Factura con ID ${id} no encontrada` });
      }
    } catch (error) {
      reply.code(500).send({ error: 'Error interno del servidor' });
    }
  });

  // Ruta para crear una nueva factura
  app.post('/', async (request, reply) => {
    const { client, date, concept, cuantity, price, total } = request.body;

    try {
      const newFactura = await prisma.factura.create({
        data: { client, date, concept, cuantity, price, total },
      });
      reply.send({ factura: newFactura });
    } catch (error) {
      reply.code(500).send({ error: 'Error interno del servidor' });
    }
  });

  // Ruta para actualizar una factura existente
  app.put('/:id', async (request, reply) => {
    const { id } = request.params;
    let { client,date,concept, cuantity, price, total } = request.body;

    if (typeof cuantity === 'string') {
      cuantity = parseFloat(cuantity);
    }
    if (typeof price === 'string') {
        price = parseFloat(price);
    }
    if (typeof total === 'string') {
        total = parseFloat(total);
    }

    // Convertir la fecha si es una cadena
    if (typeof date === 'string') {
        date = new Date(date);
    }

    try {
      console.log(request.body)
      const updatedFactura = await prisma.factura.update({
        where: { id: Number(id) },
        data: { client, date, concept, cuantity, price, total},
      });
      reply.send({ factura: updatedFactura });
    } catch (error) {
      reply.code(500).send({ error: 'Error interno del servidor al realizar el update' });
    }
  });

  // Ruta para eliminar una factura
  app.delete('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      await prisma.factura.delete({
        where: { id: Number(id) },
      });
      reply.send({ message: `Factura con ID ${id} eliminada correctamente` });
    } catch (error) {
      reply.code(500).send({ error: 'Error interno del servidor' });
    }
  });
}

export default facturaRoutes;
