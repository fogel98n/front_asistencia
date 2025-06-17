import { mostrarGrados } from "./grados.js";

export async function maestroview(usuario, sinBotones = true) {
  const contenedor = document.createElement("section");
  // esperar a que mostrarGrados devuelva el elemento
  const gradosContainer = await mostrarGrados(null, usuario, sinBotones);
  contenedor.appendChild(gradosContainer);
  return contenedor;
}
