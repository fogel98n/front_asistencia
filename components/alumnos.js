import { agregar_alumnos } from "./btn.js";
import { header } from "./header.js";

export async function mostrarAlumnos(idGrado, usuario, claseExtra = "", mostrarBotones = false) {
  const contenedorAlumnos = document.createElement("div");
  contenedorAlumnos.className = "alumnos-listado";

  if (claseExtra) {
    contenedorAlumnos.classList.add(claseExtra);
  }

  contenedorAlumnos.appendChild(header(usuario));

  try {
    const res = await fetch("http://localhost:3000/alumnos");
    if (!res.ok) throw new Error("Error al cargar alumnos");

    const alumnos = await res.json();
    const filtrados = alumnos.filter((a) => String(a.id_grado) === String(idGrado));

    if (filtrados.length === 0) {
      contenedorAlumnos.textContent = "No hay alumnos para este grado.";
    } else {
      filtrados.forEach((alumno) => {
        const div = document.createElement("div");
        div.className = "alumno-item";

        // Nombre del alumno
        const nombreSpan = document.createElement("span");
        nombreSpan.textContent = alumno.nombre;
        div.appendChild(nombreSpan);

        if (mostrarBotones) {
          div.appendChild(btn(alumno.id_alumno)); // Todos los botones juntos
        }

        contenedorAlumnos.appendChild(div);
      });
    }
  } catch (error) {
    contenedorAlumnos.textContent = "Error al cargar alumnos: " + error.message;
    contenedorAlumnos.style.color = "red";
  }

  if (mostrarBotones) {
    const btnAgregarAlumno = agregar_alumnos("btn-alumno", "Agregar Alumno");
    btnAgregarAlumno.addEventListener("click", () => {
      console.log("idNivel que se pasa al agregar alumno:", usuario.id_nivel);
      mostrarPanelAgregarAlumno(idGrado, usuario.id_nivel);
    });

    contenedorAlumnos.appendChild(btnAgregarAlumno);
  }

  return contenedorAlumnos;
}

export function btn(idAlumno) {
  const contenedorBotones = document.createElement("div");
  contenedorBotones.className = "botones-contenedor";

  // Botón asistencia
  const btnAsistencia = document.createElement("button");
  btnAsistencia.className = "btn-asistencia sin-borde";
  let estado = "presente";
  btnAsistencia.style.backgroundColor = "#4CAF50";

  btnAsistencia.addEventListener("click", async () => {
    estado = estado === "presente" ? "ausente" : "presente";
    btnAsistencia.style.backgroundColor = estado === "presente" ? "#4CAF50" : "#F44336";

    try {
      const res = await fetch("http://localhost:3000/asistencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          {
            id_alumno: idAlumno,
            fecha: new Date().toISOString().slice(0, 10),
            estado: estado,
          },
        ]),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Error al enviar asistencia: " + (errorData.error || res.statusText));
      } else {
        console.log(`Asistencia enviada para alumno ${idAlumno}: ${estado}`);
      }
    } catch (error) {
      alert("Error de conexión al enviar asistencia");
      console.error(error);
    }
  });

  
  const btnUniforme = document.createElement("button");
  btnUniforme.className = "btn-uniforme";
  btnUniforme.addEventListener("click", () => mostrarPanelUniforme(idAlumno));

  
  const btnMsj = document.createElement("button");
  btnMsj.className = "btn-msj";
  const imgMsj = document.createElement("img");
  imgMsj.src = "./media/iconmsj.png";
  imgMsj.alt = "Mensaje";
  imgMsj.className = "btn-msj-icon";
  btnMsj.appendChild(imgMsj);
  btnMsj.addEventListener("click", () => {
    const email = "";
    const subject = "Asunto del correo";
    const body = "Cuerpo del mensaje";
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`,
      "_blank"
    );
  });

  // Botón eliminar
  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "X";
  btnEliminar.className = "btn-eliminar";
  btnEliminar.title = "Eliminar alumno";

  btnEliminar.addEventListener("click", async () => {
    const password = prompt("Ingrese la contraseña para eliminar el alumno:");
    if (password === null) return; // Canceló

    const passwordCorrecta = "tuContrasenaSegura"; // Cambia aquí por tu contraseña

    if (password !== passwordCorrecta) {
      alert("Contraseña incorrecta. No se eliminará el alumno.");
      return;
    }

    if (!confirm(`¿Seguro que quieres eliminar al alumno?`)) return;

    try {
      const resDelete = await fetch(`http://localhost:3000/alumnos/${idAlumno}`, {
        method: "DELETE",
      });

      if (!resDelete.ok) {
        const errorData = await resDelete.json();
        alert("Error al eliminar alumno: " + (errorData.error || resDelete.statusText));
        return;
      }

      alert("Alumno eliminado correctamente.");
      btnEliminar.closest(".alumno-item").remove();
    } catch (error) {
      alert("Error de conexión al eliminar alumno.");
      console.error(error);
    }
  });

  contenedorBotones.appendChild(btnAsistencia);
  contenedorBotones.appendChild(btnUniforme);
  contenedorBotones.appendChild(btnMsj);
  contenedorBotones.appendChild(btnEliminar);

  return contenedorBotones;
}

export function mostrarPanelAgregarAlumno(idGrado, idNivel) {
 
  alert(`Mostrar panel para agregar alumno en grado ${idGrado}, nivel ${idNivel}`);
}

export function mostrarPanelUniforme(idAlumno) {
  
  alert(`Mostrar panel de uniforme para alumno ${idAlumno}`);
}

