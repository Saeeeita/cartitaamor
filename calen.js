const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

let fecha = new Date();
let mesActual = fecha.getMonth();
let anioActual = fecha.getFullYear();

const mesTitulo = document.getElementById("mes-actual");
const diasTabla = document.getElementById("dias-mes");

// Obtener eventos guardados en LocalStorage
let eventos = JSON.parse(localStorage.getItem("eventos")) || {};

function guardarEventos() {
    localStorage.setItem("eventos", JSON.stringify(eventos));
}

function generarCalendario(mes, anio) {
    mesTitulo.innerText = `${meses[mes]} ${anio}`;
    diasTabla.innerHTML = "";

    let primerDia = new Date(anio, mes, 1).getDay();
    let totalDias = new Date(anio, mes + 1, 0).getDate();
    let fila = document.createElement("tr");

    for (let i = 0; i < primerDia; i++) {
        let celdaVacia = document.createElement("td");
        fila.appendChild(celdaVacia);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
        let celda = document.createElement("td");
        celda.innerText = dia;
        celda.classList.add("dia");

        let fechaClave = `${anio}-${mes}-${dia}`;
        if (eventos[fechaClave]) {
            celda.classList.add("evento");
            celda.title = eventos[fechaClave]; // Tooltip con el evento
        }

        celda.addEventListener("click", () => agregarEvento(fechaClave, celda));
        fila.appendChild(celda);

        if ((primerDia + dia) % 7 === 0 || dia === totalDias) {
            diasTabla.appendChild(fila);
            fila = document.createElement("tr");
        }
    }
}

function agregarEvento(fecha, celda) {
    let evento = prompt("Escribe el evento para esta fecha:");
    if (evento) {
        eventos[fecha] = evento;
        guardarEventos();
        celda.classList.add("evento");
        celda.title = evento;
    }
}

document.getElementById("prevMonth").addEventListener("click", () => {
    if (mesActual === 0) {
        mesActual = 11;
        anioActual--;
    } else {
        mesActual--;
    }
    generarCalendario(mesActual, anioActual);
});

document.getElementById("nextMonth").addEventListener("click", () => {
    if (mesActual === 11) {
        mesActual = 0;
        anioActual++;
    } else {
        mesActual++;
    }
    generarCalendario(mesActual, anioActual);
});

generarCalendario(mesActual, anioActual);

const eventosLista = document.getElementById("eventos-lista");

function actualizarListaEventos() {
    eventosLista.innerHTML = "";
    Object.keys(eventos).forEach(fecha => {
        let li = document.createElement("li");
        li.innerHTML = `${fecha}: ${eventos[fecha]} <button class="eliminar-btn" data-fecha="${fecha}">❌</button>`;
        eventosLista.appendChild(li);
    });

    // Agregar evento a los botones de eliminar
    document.querySelectorAll(".eliminar-btn").forEach(boton => {
        boton.addEventListener("click", (e) => {
            let fecha = e.target.getAttribute("data-fecha");
            eliminarEvento(fecha);
        });
    });
}

function eliminarEvento(fecha) {
    delete eventos[fecha];
    guardarEventos();
    actualizarListaEventos();
    generarCalendario(mesActual, anioActual); // Actualizar calendario
}

// Llamar a la función al cargar la página
actualizarListaEventos();