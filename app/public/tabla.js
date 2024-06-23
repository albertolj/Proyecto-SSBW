// tabla.js
// para que no se ejecute hasta que la página esté totalmente cargada
window.onload = async () => {
    console.log("La página está totalmente cargada");

    try {
        const res = await fetch('/api/facturas/');
        if (!res.ok) {
            throw new Error(`Error en la solicitud: ${res.statusText}`);
        }

        const data = await res.json();
        const facturas = data.data;

        const tbody = document.querySelector('tbody');

        let tbodyHtml = '';
        facturas.forEach(fac => {
            fac.date = fac.date.slice(0, 10); // Asume que el formato de fecha es YYYY-MM-DD
            tbodyHtml += `
                <tr>
                    <td>${fac.id}</td>
                    <td>
                        <input type="text" value="${fac.client}" name="client" data-id="${fac.id}">
                    </td>
                    <td>
                        <input type="text" value="${fac.date}" name="date" data-id="${fac.id}">
                    </td>
                    <td>
                        <input type="text" value="${fac.concept}" name="concept" data-id="${fac.id}">
                    </td>
                    <td>
                        <input type="number" value="${fac.cuantity}" name="cuantity" data-id="${fac.id}">
                    </td>
                    <td>
                        <input type="number" value="${fac.price}" name="price" data-id="${fac.id}">
                    </td>
                    <td>
                        <input type="number" value="${fac.total}" name="total" data-id="${fac.id}">
                    </td>
                </tr>
            `;
        });

        // Actualiza la tabla
        tbody.innerHTML = tbodyHtml;

        tbody.addEventListener('change', async (evt) => {
            const value = evt.target.value;
            const name = evt.target.name;
            const id = evt.target.dataset.id;

            console.log(`Cambios en ${id} ${name} ${value}`);

            updateFactura(id, name, value);
        });
    } catch (error) {
        console.error('Error al cargar las facturas:', error);
    }
};

async function updateFactura(id, name, value) {
    try {

        const res = await fetch(`/api/facturas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ [name]: value })
        });

        if (!res.ok) {
            throw new Error(`Error en la solicitud: ${res.statusText}`);
        }

        const result = await res.json();
        console.log('Factura actualizada:', result);

        // Mostrar mensaje de éxito al usuario
        const message = document.getElementById('message');
        message.textContent = `Factura ${id} actualizada correctamente`;
        message.style.display = 'block';
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
    } catch (error) {
        console.error('Error al actualizar la factura:', error);
    }
}

