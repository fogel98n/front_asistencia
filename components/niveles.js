import { mostrarGrados } from "./grados.js";
import { header } from "./header.js"; 

export async function gradospanel(usuario) {
    const esCoordinador = usuario.rol === "coordinador";

    const contenedor = document.createElement("div");
    contenedor.className = "grados-contenedor";

    contenedor.appendChild(header(usuario));

    if (!esCoordinador) {
        const mensaje = document.createElement("p");
        
        mensaje.style.fontWeight = "bold";
        mensaje.style.textAlign = "center";
        contenedor.appendChild(mensaje);
        return contenedor;
    }

    try {
        const res = await fetch("http://localhost:3000/niveles_educativos");
        if (!res.ok) throw new Error("Error al cargar niveles educativos");

        const niveles = await res.json();

        if (niveles.length) {
            niveles.forEach(nivel => {
                const nivelDiv = document.createElement("div");
                nivelDiv.className = "nivel-item";
                nivelDiv.textContent = nivel.nombre_nivel || "Nombre no definido";

                nivelDiv.addEventListener("click", async () => {
                    const root = document.getElementById("root");
                    root.innerHTML = "";

                    // Coordinador sí ve botones
                    const gradosContainer = await mostrarGrados(nivel.id_nivel, usuario, true);
                    root.appendChild(gradosContainer);
                });

                contenedor.appendChild(nivelDiv);
            });
        } else {
            const mensaje = document.createElement("p");
            mensaje.textContent = "No hay niveles educativos disponibles.";
            contenedor.appendChild(mensaje);
        }
    } catch (error) {
        const mensajeError = document.createElement("p");
        mensajeError.style.color = "red";
        mensajeError.textContent = `Error cargando niveles educativos: ${error.message}`;
        contenedor.appendChild(mensajeError);
    }

    return contenedor;
}
