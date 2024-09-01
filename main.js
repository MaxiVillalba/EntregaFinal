const containerUno = document.getElementById("containeruno");
const containerDos = document.getElementById("containerdos");
const carritoContainer = document.getElementById("carrito-items");
const carritoVacioMsg = document.getElementById("carrito-vacio");

class Destino {
    constructor(destino, duracion, tipoDeHotel, temporada, precio, imagen) {
        this.destino = destino;
        this.duracion = duracion;
        this.tipoDeHotel = tipoDeHotel;
        this.temporada = temporada;
        this.precio = precio;
        this.imagen = imagen;
    }

    getResumen() {
        return `${this.destino}: ${this.duracion} días, ${this.tipoDeHotel}. Temporada: ${this.temporada}. Precio: USD ${this.precio}`;
    }
}

class Adicional {
    constructor(tipodeadicional, preciodeadicional, imagen) {
        this.tipodeadicional = tipodeadicional;
        this.preciodeadicional = preciodeadicional;
        this.imagen = imagen;
    }

    getResumen() {
        return `${this.tipodeadicional}: USD ${this.preciodeadicional}`;
    }
}


const destinos = [
    new Destino("Dubai", 14, "Desayuno incluido", "Octubre - Noviembre", 3500),
    new Destino("Paris", 15, "Desayuno Incluido", "Marzo - Abril", 3300),
    new Destino("Londres", 12, "Desayuno Incluido", "Febrero - Abril", 3700),
    new Destino("Rio de Janeiro", 14, "Desayuno Incluido", "Diciembre - Abril", 2500),
    new Destino("Cancún", 14, "All Inclusive", "Diciembre - Enero", 3800),
    new Destino("Bariloche", 10, "Media Pensión", "Julio - Septiembre", 1500),
    new Destino("Iguazu", 6, "Media Pensión", "Mayo - Agosto", 1200),
];

const adicionales = [
    new Adicional("Seguro de viaje", 100),
    new Adicional("Alquiler de auto", 150),
    new Adicional("Traslados internos", 50),
    new Adicional("Parque de diversiones", 70),
    new Adicional("Paseo en lancha", 30),
    new Adicional("Servicio de conserje", 20),
    new Adicional("Entradas para recital", 60),
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || {
    destino: null,
    adicionales: []
};

const crearCardDestino = destino => {
    const card = document.createElement("div");
    card.className = "card";
    card.id = `Destino-${destino.destino}`;

    card.innerHTML = `
        <img src="${destino.imagen}" alt="${destino.destino}" class="card-img">
        <h3>${destino.destino}</h3>
        <p>Duración: ${destino.duracion} días</p>
        <p>Tipo de hotel: ${destino.tipoDeHotel}</p>
        <p>Temporada: ${destino.temporada}</p>
        <p>Precio: USD ${destino.precio}</p>
        <button>Agregar a cesta</button>
    `;

    card.querySelector("button").addEventListener("click", () => agregarDestinoACesta(destino));
    containerUno.append(card);
}

const crearCardAdicional = adicional => {
    const card = document.createElement("div");
    card.className = "card";
    card.id = `Adicional-${adicional.tipodeadicional}`;

    card.innerHTML = `
        <img src="${adicional.imagen}" alt="${adicional.tipodeadicional}" class="card-img">
        <h3>${adicional.tipodeadicional}</h3>
        <p>Precio: USD ${adicional.preciodeadicional}</p>
        <button>Agregar a cesta</button>
    `;

    card.querySelector("button").addEventListener("click", () => agregarAdicionalACesta(adicional));
    containerDos.append(card);
}

const actualizarCarrito = () => {
    carritoContainer.innerHTML = '';
    const { destino, adicionales } = carrito;

    if (!destino && adicionales.length === 0) {
        carritoVacioMsg.style.display = "block";
    } else {
        carritoVacioMsg.style.display = "none";

        if (destino) {
            const li = document.createElement('li');
            li.textContent = destino.getResumen();
            carritoContainer.append(li);
        }

        adicionales.forEach(adicional => {
            const li = document.createElement('li');
            li.textContent = adicional.getResumen();
            carritoContainer.append(li);
        });
    }

    console.log("Carrito actualizado:", carrito);
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const agregarDestinoACesta = destino => {
    carrito.destino = destino;
    actualizarCarrito();
    Swal.fire('Destino agregado', destino.destino, 'success');
}

const agregarAdicionalACesta = adicional => {
    carrito.adicionales.push(adicional);
    actualizarCarrito();
    Swal.fire('Adicional agregado', adicional.tipodeadicional, 'success');
}

const limpiarCarrito = () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, limpiar carrito'
    }).then(result => {
        if (result.isConfirmed) {
            carrito.destino = null;
            carrito.adicionales = [];
            actualizarCarrito();
            Swal.fire('¡Eliminado!', 'Tu carrito ha sido limpiado.', 'success');
        }
    });
}

const eliminarUltimoItem = () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Eliminarás el último ítem del carrito.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar último ítem'
    }).then(result => {
        if (result.isConfirmed) {
            if (carrito.adicionales.length > 0) {
                carrito.adicionales.pop();
            } else if (carrito.destino) {
                carrito.destino = null;
            }
            actualizarCarrito();
            Swal.fire('¡Eliminado!', 'El último ítem ha sido eliminado.', 'success');
        }
    });
}

document.getElementById("limpiar-carrito").addEventListener("click", limpiarCarrito);
document.getElementById("eliminar-ultimo").addEventListener("click", eliminarUltimoItem);
document.getElementById("checkout").addEventListener("click", () => {
    if (carrito.destino || carrito.adicionales.length > 0) {
        Swal.fire('¡Gracias por tu compra!', 'Tu orden está en camino.', 'success');
    } else {
        Swal.fire('Carrito vacío', 'Por favor, agrega al menos un ítem.', 'warning');
    }
});

const inicializarInterfaz = () => {
    destinos.forEach(crearCardDestino);
    adicionales.forEach(crearCardAdicional);
    actualizarCarrito();
}

inicializarInterfaz();
