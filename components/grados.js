
import { mostrarAlumnos } from "./alumnos.js"; // ✅ Asegúrate de que la ruta sea correcta

export async function mostrarGrados(idNivel, usuario, sinBotones = false) {
  const contenedorGrados = document.createElement("div");
  contenedorGrados.className = "grados-listado";

  // Encabezado
  if (typeof header === "function") {
    contenedorGrados.appendChild(header(usuario));
  }

  // Obtener datos
  const [resGrados, resMaestros] = await Promise.all([
    fetch("http://localhost:3000/grados"),
    fetch("http://localhost:3000/maestros"),
  ]);

  if (!resGrados.ok || !resMaestros.ok) {
    contenedorGrados.textContent = "Error al cargar grados o maestros";
    return contenedorGrados;
  }

  const grados = await resGrados.json();
  const maestros = await resMaestros.json();

  const gradosFiltrados = idNivel === null
    ? grados
    : grados.filter(g => String(g.id_nivel) === String(idNivel));

  if (gradosFiltrados.length === 0) {
    contenedorGrados.textContent = "No hay grados disponibles.";
  } else {
    gradosFiltrados.forEach((grado) => {
      const div = document.createElement("div");
      div.className = "grado-item";

      const maestro = maestros.find(m => m.id_grado === grado.id_grado);
      const nombreMaestro = maestro ? maestro.nombre : "Sin asignar";

      const nombreGrado = document.createElement("strong");
      nombreGrado.textContent = grado.nombre_grado;

      const spanMaestro = document.createElement("span");
      spanMaestro.textContent = ` - Maestro: ${nombreMaestro}`;
      spanMaestro.style.display = "block";
      spanMaestro.style.fontSize = "0.9em";
      spanMaestro.style.color = "#fff";

      div.appendChild(nombreGrado);
      div.appendChild(spanMaestro);

      // 👉 Acción al dar clic: mostrar alumnos del grado
      div.addEventListener("click", async () => {
        const root = document.getElementById("root");
        root.innerHTML = "";

        if (typeof mostrarAlumnos === "function") {
          const alumnosDiv = await mostrarAlumnos(grado.id_grado, usuario, "", sinBotones);
          root.appendChild(alumnosDiv);
        }
      });

      contenedorGrados.appendChild(div);
    });
  }

  return contenedorGrados;
}
