import { gradospanel } from "./niveles.js";
import { estadística } from "./estadistica.js"; 
import { registro } from "./registro.js";
import { Login } from "./login.js";

export function menu_hamburgesa() {
    const menu = document.createElement('div');
    menu.classList.add('menu-hamburgesa');

    const line1 = document.createElement('div');
    line1.classList.add('menu-hamburgesa__line');
    const line2 = document.createElement('div');
    line2.classList.add('menu-hamburgesa__line');
    const line3 = document.createElement('div');
    line3.classList.add('menu-hamburgesa__line');

    menu.appendChild(line1);
    menu.appendChild(line2);
    menu.appendChild(line3);

    const pantallaEmergente = document.createElement('div');
    pantallaEmergente.classList.add('pantalla-emergente');

    const botonInicio = document.createElement('button');
    botonInicio.classList.add('pantalla-boton');
    botonInicio.textContent = 'Inicio';

    const botonEstadistica = document.createElement('button');
    botonEstadistica.classList.add('pantalla-boton');
    botonEstadistica.textContent = 'Estadística';

    const boton_registro = document.createElement("button");
    boton_registro.classList.add('pantalla-boton');
    boton_registro.textContent = "registro";

    const boton_cerrarSesion = document.createElement("button");
    boton_cerrarSesion.classList.add('pantalla-boton');
    boton_cerrarSesion.textContent = "cerrar sesion";

    pantallaEmergente.appendChild(botonInicio);
    pantallaEmergente.appendChild(botonEstadistica);
    pantallaEmergente.appendChild(boton_registro);
    pantallaEmergente.appendChild(boton_cerrarSesion);

    document.body.appendChild(pantallaEmergente);

    menu.addEventListener('click', () => {
        pantallaEmergente.classList.toggle('pantalla-emergente--visible');
    });

    botonInicio.addEventListener('click', async () => {
        pantallaEmergente.classList.remove('pantalla-emergente--visible');
        const root = document.getElementById("root");
        root.innerHTML = "";
        const panelNiveles = await gradospanel({ nombre: "Usuario" });
        root.appendChild(panelNiveles);
    });

    botonEstadistica.addEventListener('click', async () => {
        pantallaEmergente.classList.remove('pantalla-emergente--visible');
        const root = document.getElementById("root");
        root.innerHTML = "";
        const panelEstadistica = await estadística();
        root.appendChild(panelEstadistica);
    });

    boton_registro.addEventListener("click", async () => {
        pantallaEmergente.classList.remove('pantalla-emergente--visible');
        const root = document.getElementById("root");
        root.innerHTML = "";
        const panel_registo = await registro();
        root.appendChild(panel_registo);
    });

    boton_cerrarSesion.addEventListener("click", () => {
        pantallaEmergente.classList.remove('pantalla-emergente--visible');
        const root = document.getElementById("root");
        root.innerHTML = "";

        
        const loginPanel = Login(async (userData) => {
            root.innerHTML = "";
            
            const panelNiveles = await gradospanel({ nombre: userData.nombre || "Usuario" });
            root.appendChild(panelNiveles);
        });

        root.appendChild(loginPanel);
    });

    return menu;
}
