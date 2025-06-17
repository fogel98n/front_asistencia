import { maestroview } from "./vistaProfesor.js";

export function Login(onSuccess) {
  const contenedor = document.createElement("div");
  contenedor.className = "contenedor-login";

  const style = document.createElement("style");
  style.textContent = `
    .contenedor-login {
      max-width: 320px;
      margin: auto;
      font-family: Arial, sans-serif;
      border: 1px solid #ccc;
      padding: 20px;
      border-radius: 6px;
      box-shadow: 0 0 10px #ddd;
      background: #fff;
    }
    .login-imagen {
      display: block;
      margin: 0 auto 15px;
      width: 80px;
      height: 80px;
      object-fit: contain;
    }
    form {
      display: flex;
      flex-direction: column;
    }
    label {
      margin-top: 10px;
      font-weight: bold;
    }
    input {
      padding: 8px;
      margin-top: 4px;
      font-size: 1em;
      border: 1px solid #aaa;
      border-radius: 4px;
    }
    button {
      margin-top: 20px;
      padding: 10px;
      font-size: 1em;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    button:disabled {
      background-color: #aaa;
      cursor: default;
    }
    button:hover:not(:disabled) {
      background-color: #0056b3;
    }
    .message {
      margin-top: 15px;
      padding: 10px;
      border-radius: 4px;
      font-weight: bold;
    }
    .message.error {
      background-color: #f8d7da;
      color: #842029;
    }
    .message.success {
      background-color: #d1e7dd;
      color: #0f5132;
    }
  `;
  contenedor.appendChild(style);

  const imagen = document.createElement("img");
  imagen.src = "./media/user.png";
  imagen.alt = "Logo";
  imagen.className = "login-imagen";

  const form = document.createElement("form");

  function crearInput({ id, type, labelText, placeholder, required = false }) {
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;

    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    if (placeholder) input.placeholder = placeholder;
    if (required) input.required = true;

    return { label, input };
  }

  const { label: labelEmail, input: inputEmail } = crearInput({
    id: "email",
    type: "email",
    labelText: "Correo:",
    placeholder: "ejemplo@correo.com",
    required: true,
  });

  const { label: labelPassword, input: inputPassword } = crearInput({
    id: "password",
    type: "password",
    labelText: "Contraseña:",
    placeholder: "********",
    required: true,
  });

  const boton = document.createElement("button");
  boton.type = "submit";
  boton.textContent = "Entrar";

  const messageBox = document.createElement("div");
  messageBox.className = "message";
  messageBox.style.display = "none";

  form.append(labelEmail, inputEmail, labelPassword, inputPassword, boton, messageBox);
  contenedor.append(imagen, form);

  function mostrarMensaje(text, tipo = "error") {
    messageBox.textContent = text;
    messageBox.className = `message ${tipo}`;
    messageBox.style.display = "block";
  }

  function ocultarMensaje() {
    messageBox.style.display = "none";
  }

  function decodeJWT(token) {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  async function renderVistaMaestro(usuario) {
    const root = document.getElementById("root");
    root.innerHTML = "";
    const maestroContenedor = await maestroview(usuario);
    root.appendChild(maestroContenedor);
  }

  async function renderVistaCoordinador(usuario) {
    const root = document.getElementById("root");
    root.innerHTML = "";
    const coordinadorContenedor = await coordinadorview(usuario);
    root.appendChild(coordinadorContenedor);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    ocultarMensaje();

    if (inputPassword.value.length < 5) {
      mostrarMensaje("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const data = {
      email: inputEmail.value.trim(),
      password: inputPassword.value,
    };

    boton.disabled = true;
    boton.textContent = "Cargando...";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch("http://localhost:3000/login_asistencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Error al iniciar sesión");

      const userData = decodeJWT(result.token);

      mostrarMensaje("Inicio de sesión exitoso.", "success");

      if (typeof onSuccess === "function") onSuccess(userData);

      if (userData.rol === "maestro") {
        await renderVistaMaestro(userData);
      } else if (userData.rol === "coordinador") {
        await renderVistaCoordinador(userData);
      } else {
        mostrarMensaje("Rol no reconocido o no implementado.", "error");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        mostrarMensaje("Tiempo de espera agotado, intenta más tarde.");
      } else {
        mostrarMensaje("Error al iniciar sesión: " + err.message);
      }
    } finally {
      boton.disabled = false;
      boton.textContent = "Entrar";
    }
  });

  return contenedor;
}


