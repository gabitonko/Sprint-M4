document.addEventListener('DOMContentLoaded', () => {
    // Variables
    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMiva = document.querySelector('#iva');
    const DOMbruto = document.querySelector('#tbruto');
    const DOMenvio = document.querySelector ('#envio');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    
              // Funciones
    
              /**
              * Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
              */
function renderizarProductos() {
        baseDeDatos.forEach((info) => {
                      // Estructura
        const miNodo = document.createElement('div');
        miNodo.classList.add('card', 'col-sm-4');
                      // Body
        const miNodoCardBody = document.createElement('div');
        miNodoCardBody.classList.add('card-body');
                      // Titulo
        const miNodoTitle = document.createElement('h5');
        miNodoTitle.classList.add('card-title');
        miNodoTitle.textContent = info.nombre;
                    //código
        const miNodoCod = document.createElement('p');
        miNodoCod.classList.add('card-text');
        miNodoCod.textContent = `Código ${info.id} `;
                    //Descripcion
        const miNodoDescripcion = document.createElement('p');
        miNodoDescripcion.classList.add('card-text');
        miNodoDescripcion.textContent= info.descripcion;
                     // Imagen
        const miNodoImagen = document.createElement('img');
        miNodoImagen.classList.add('img-fluid');
        miNodoImagen.setAttribute('src', info.imagen);
                      // Precio
        const miNodoPrecio = document.createElement('p');
        miNodoPrecio.classList.add('card-text');
        miNodoPrecio.textContent = `${divisa}${info.precio}`;
                      // Boton 
        const miNodoBoton = document.createElement('button');
        miNodoBoton.classList.add('btn', 'btn-primary');
        miNodoBoton.textContent = 'Agregar al carrito';
        miNodoBoton.setAttribute('marcador', info.id);
        miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
                      // Insertamos
        miNodoCardBody.appendChild(miNodoImagen);
        miNodoCardBody.appendChild(miNodoTitle);
        miNodoCardBody.appendChild(miNodoCod);
        miNodoCardBody.appendChild(miNodoDescripcion);
        miNodoCardBody.appendChild(miNodoPrecio);
        miNodoCardBody.appendChild(miNodoBoton);
        miNodo.appendChild(miNodoCardBody);
        DOMitems.appendChild(miNodo);
                  });
}
              /*
              * Evento para añadir un producto al carrito de la compra
              */
function anyadirProductoAlCarrito(evento) 
{
    // Anyadimos el Nodo a nuestro carrito
    carrito.push(evento.target.getAttribute('marcador'))
                  // Actualizamos el carrito 
    renderizarCarrito();
}
              /*
              Dibuja todos los productos guardados en el carrito
              */
function renderizarCarrito() 
{
                // Vaciamos todo el html
    DOMcarrito.textContent = '';
                // Quitamos los duplicados
    const carritoSinDuplicados = [...new Set(carrito)];
                // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => 
    {
                  // Obtenemos el item que necesitamos de la variable base de datos
        const miItem = baseDeDatos.filter((itemBaseDatos) => 
        {
                    // ¿Coincide las id? Solo puede existir un caso
            return itemBaseDatos.id === parseInt(item);
        });
                  // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carrito.reduce((total, itemId) =>
        {
                    // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
        return itemId === item ? total += 1 : total;
        }, 0);
        //Calcula el precio total del producto en el carrito
        const precioTotal = miItem[0].precio * numeroUnidadesItem;
                  // Creamos el nodo del item del carrito
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa}${miItem[0].precio}`;

                      // Boton de borrar
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger', 'mx-5');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);
                      // Mezclamos nodos
        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
        
    });
    calcularTotal();
}
function calcularTotal() 
{
        // Recorremos el array del carrito 
    const subtotal = carrito.reduce((total, item) => 
    {
                                          // De cada elemento obtenemos su precio
        const miItem = baseDeDatos.filter((itemBaseDatos) => 
        {
            return itemBaseDatos.id === parseInt(item);
        });
                                      // Los sumamos al total
        return total + miItem[0].precio;
    }, 0);

    // Calculamos el precio total
    const totalSinEnvio = subtotal;
    const iva = totalSinEnvio * 0.19;
    const totalBruto = totalSinEnvio * 1.19;
// Agregamos el costo de envío si corresponde
    let costoEnvio = 0;
    if (totalBruto < 100000) 
    {
        costoEnvio = totalBruto * 0.05;
        DOMenvio.textContent = '$' + parseInt(costoEnvio);
    } else 
    {
        DOMenvio.textContent = '¡Tienes envío gratuito! y un gatito';
    }
// Renderizamos los totales en el HTML
    DOMtotal.textContent = `$` + (totalSinEnvio + costoEnvio);
    DOMiva.textContent = iva;
    DOMbruto.textContent = totalBruto;
    DOMcalcularTotal.textContent = totalBruto;
}
              /**
              * Evento para borrar un elemento del carrito */
function borrarItemCarrito(evento) 
{
    // Obtenemos el producto ID que hay en el boton pulsado
    const id = evento.target.dataset.item;
                  // Borramos todos los productos
    carrito = carrito.filter((carritoId) => 
    {
        return carritoId !== id;
    });
                  // volvemos a renderizar
    renderizarCarrito();
}
              /**
              * Varia el carrito y vuelve a dibujarlo
              */
function vaciarCarrito() 
{
    // Limpiamos los productos guardados
    carrito = [];
                  // Renderizamos los cambios
    renderizarCarrito();
};
    
              // Eventos
DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    
              // Inicio
renderizarProductos();
renderizarCarrito();
            });