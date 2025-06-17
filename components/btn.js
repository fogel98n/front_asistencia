export function agregar_alumnos(clase, contenido) {
    const contenedor = document.createElement("div");
    contenedor.className = "contenedor-boton";

    const boton = document.createElement("button");
    boton.className = clase;
    boton.textContent = contenido;

    contenedor.appendChild(boton);

    return contenedor;
}