const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const hudPiso = document.getElementById("hud-piso");
const hudPuntos = document.getElementById("hud-puntos");
const hudRitmo = document.getElementById("hud-ritmo");
const avisoHito = document.getElementById("aviso-hito");
const modalFin = document.getElementById("modal-fin");
const textoResultado = document.getElementById("texto-resultado");
const btnReintentar = document.getElementById("btn-reintentar");

const escudo = new Image();
escudo.src = "escudo-ipet249.png";

const GRAVEDAD = 0.52;
const FRICCION = 0.85;
const ACELERACION_X = 0.9;
const SALTO = -12.2;

const velocidadInicial = parseFloat(sessionStorage.getItem("velocidadBase")) || 1.1;

let jugando = false;
let puntos = 0;
let pisoActual = 0;
let multiplicador = 1.0;
let hitosMostrados = new Set();
let timerAviso = null;

const jugador = {
  x: 195,
  y: 480,
  w: 28,
  h: 34,
  vx: 0,
  vy: 0,
  enSuelo: false
};

let plataformas = [];
const teclas = {};

window.addEventListener("keydown", (e) => {
  teclas[e.code] = true;
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(e.code)) {
    e.preventDefault();
  }
});

window.addEventListener("keyup", (e) => {
  teclas[e.code] = false;
});

function configurarBotonTactil(id, codigoTecla) {
  const el = document.getElementById(id);
  if (!el) return;

  const activar = (e) => {
    e.preventDefault();
    teclas[codigoTecla] = true;
  };
  const desactivar = (e) => {
    e.preventDefault();
    teclas[codigoTecla] = false;
  };

  el.addEventListener("touchstart", activar, { passive: false });
  el.addEventListener("touchend", desactivar, { passive: false });
  el.addEventListener("touchcancel", desactivar, { passive: false });
  el.addEventListener("mousedown", activar);
  el.addEventListener("mouseup", desactivar);
  el.addEventListener("mouseleave", desactivar);
}

configurarBotonTactil("btn-izq", "ArrowLeft");
configurarBotonTactil("btn-der", "ArrowRight");
configurarBotonTactil("btn-salto", "Space");

function mostrarAviso(mensaje) {
  avisoHito.textContent = mensaje;
  avisoHito.classList.remove("oculto");
  clearTimeout(timerAviso);
  timerAviso = setTimeout(() => {
    avisoHito.classList.add("oculto");
  }, 2600);
}

function crearPlataforma(piso, y) {
  const ancho = piso % 10 === 0 ? canvas.width - 24 : Math.floor(Math.random() * 80) + 85;
  const x = piso % 10 === 0 ? 12 : Math.floor(Math.random() * (canvas.width - ancho));
  const impulso = piso > 0 && piso % 5 === 0 && piso % 10 !== 0;
  return { x, y, w: ancho, h: 15, piso, impulso };
}

function reiniciarPartida() {
  puntos = 0;
  pisoActual = 0;
  multiplicador = 1.0;
  hitosMostrados.clear();

  jugador.x = canvas.width / 2 - jugador.w / 2;
  jugador.y = 470;
  jugador.vx = 0;
  jugador.vy = 0;
  jugador.enSuelo = true;

  plataformas = [
    { x: 0, y: 505, w: canvas.width, h: 20, piso: 0, impulso: false }
  ];
  for (let i = 1; i <= 10; i++) {
    plataformas.push(crearPlataforma(i, 505 - i * 78));
  }

  actualizarHUD();
  modalFin.classList.add("oculto");
  avisoHito.classList.add("oculto");
  jugando = true;
  requestAnimationFrame(loop);
}

function actualizarHUD() {
  hudPiso.textContent = pisoActual;
  hudPuntos.textContent = puntos;
  hudRitmo.textContent = multiplicador.toFixed(1) + "x";
}

function registrarPiso(nuevoPiso) {
  if (nuevoPiso > pisoActual) {
    const subidos = nuevoPiso - pisoActual;
    pisoActual = nuevoPiso;
    puntos += subidos * 10;

    multiplicador = 1.0 + Math.floor(pisoActual / 10) * 0.25;

    if (pisoActual > 0 && pisoActual % 10 === 0 && !hitosMostrados.has(pisoActual)) {
      hitosMostrados.add(pisoActual);
      puntos += 50;
      mostrarAviso(`¡Hito Piso ${pisoActual}: +50 pts en Informática!`);
    }
    actualizarHUD();
  }
}

function actualizar() {
  if (teclas["ArrowLeft"] || teclas["KeyA"]) jugador.vx -= ACELERACION_X;
  if (teclas["ArrowRight"] || teclas["KeyD"]) jugador.vx += ACELERACION_X;

  jugador.vx *= FRICCION;
  jugador.x += jugador.vx;

  if (jugador.x < 0) {
    jugador.x = 0;
    jugador.vx *= -0.5;
  } else if (jugador.x + jugador.w > canvas.width) {
    jugador.x = canvas.width - jugador.w;
    jugador.vx *= -0.5;
  }

  if ((teclas["Space"] || teclas["ArrowUp"] || teclas["KeyW"]) && jugador.enSuelo) {
    const extraSalto = Math.abs(jugador.vx) > 4 ? -3.2 : 0;
    jugador.vy = SALTO + extraSalto;
    jugador.enSuelo = false;
  }

  jugador.vy += GRAVEDAD;
  jugador.y += jugador.vy;
  jugador.enSuelo = false;

  if (jugador.vy >= 0) {
    for (const p of plataformas) {
      const enX = jugador.x + jugador.w > p.x + 4 && jugador.x < p.x + p.w - 4;
      const enY = jugador.y + jugador.h >= p.y && jugador.y + jugador.h - jugador.vy <= p.y + p.h;
      if (enX && enY) {
        jugador.y = p.y - jugador.h;
        jugador.vy = 0;
        jugador.enSuelo = true;

        if (p.impulso) {
          jugador.vy = SALTO * 1.3;
          jugador.enSuelo = false;
        }
        registrarPiso(p.piso);
        break;
      }
    }
  }

  let subida = 0;
  if (pisoActual >= 1) {
    subida = velocidadInicial * multiplicador;
  }
  if (jugador.y < 190) {
    subida += (190 - jugador.y) * 0.14;
  }

  if (subida > 0) {
    jugador.y += subida;
    for (const p of plataformas) {
      p.y += subida;
    }
  }

  plataformas = plataformas.filter((p) => p.y < canvas.height + 30);
  while (plataformas.length < 11) {
    const ultima = plataformas[plataformas.length - 1];
    plataformas.push(crearPlataforma(ultima.piso + 1, ultima.y - 78));
  }

  if (jugador.y > canvas.height) {
    jugando = false;
    textoResultado.textContent = `Llegaste al piso ${pisoActual} con ${puntos} puntos.`;
    modalFin.classList.remove("oculto");
  }
}

function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (escudo.complete && escudo.naturalWidth > 0) {
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.drawImage(escudo, canvas.width / 2 - 75, canvas.height / 2 - 75, 150, 150);
    ctx.restore();
  }

  for (const p of plataformas) {
    ctx.fillStyle = p.impulso ? "#f4c430" : p.piso % 10 === 0 ? "#d62828" : "#8c1624";
    ctx.strokeStyle = "#f4c430";
    ctx.lineWidth = 2;
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.strokeRect(p.x, p.y, p.w, p.h);

    ctx.fillStyle = p.impulso ? "#3d070e" : "#ffffff";
    ctx.font = "bold 10px monospace";
    ctx.fillText(`P${p.piso}`, p.x + 6, p.y + 11);
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(jugador.x, jugador.y, jugador.w, jugador.h);
  ctx.strokeStyle = "#f4c430";
  ctx.lineWidth = 2;
  ctx.strokeRect(jugador.x, jugador.y, jugador.w, jugador.h);

  ctx.fillStyle = "#6b0f1a";
  ctx.fillRect(jugador.x + 3, jugador.y + 12, jugador.w - 6, jugador.h - 14);
}

function loop() {
  if (!jugando) return;
  actualizar();
  dibujar();
  requestAnimationFrame(loop);
}

btnReintentar.addEventListener("click", reiniciarPartida);
reiniciarPartida();
