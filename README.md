# Icy Tower – IPET Nº 249 “Nicolás Copérnico”

**Especialidad:** Informática  
**Asignatura:** Laboratorio de Programación  
**Curso:** 6º G  
**Año:** 2026

## Descripción
Adaptación institucional del videojuego de plataformas Icy Tower. Se conservaron las mecánicas principales del proyecto base y se incorporaron una portada propia, la identidad visual del IPET Nº 249 y mensajes relacionados con la especialidad de Informática.

## Proyecto base y créditos
El desarrollo parte del repositorio [chavi362/Icy-Tower](https://github.com/chavi362/Icy-Tower). Se mantiene la referencia al autor y al proyecto original. Esta adaptación agrega cambios de presentación y una modificación funcional en JavaScript.

## Cambios realizados
- `index.html`: nueva portada en español, presentación institucional y acceso al juego.
- `css/institucional.css`: diseño de la portada con bordó, amarillo, rojo y blanco.
- `image/escudo-ipet249.png`: escudo incorporado a partir de la imagen incluida en la consigna del TP.
- `html/difficulty-levels.html`: niveles traducidos y referencias al colegio.
- `html/tower.html` y `css/institucional-juego.css`: interfaz de juego adaptada a los colores institucionales.
- `js/tower.js`: se agregó un sistema de hitos que muestra mensajes al alcanzar 30, 60, 90 y 120 puntos (Hardware, Programación, Redes y Bases de Datos). También se corrigió la condición de cambio al segundo nivel de dificultad y se agregó un usuario de respaldo para iniciar sin registro.

## Cómo ejecutar
1. Descargar o clonar este repositorio.
2. Abrir la carpeta con Visual Studio Code.
3. Ejecutar `index.html` con Live Server (recomendado) o publicar el repositorio con GitHub Pages.
4. Presionar **Jugar ahora**, elegir dificultad y comenzar.

## Controles
- Flecha izquierda: moverse a la izquierda.
- Flecha derecha: moverse a la derecha.
- Flecha arriba: saltar.

El puntaje aumenta al avanzar sobre las plataformas. Los hitos institucionales aparecen a medida que se alcanzan los puntajes indicados.

## Publicación en GitHub Pages
Subir el contenido de esta carpeta a un repositorio de GitHub. En **Settings → Pages**, seleccionar la rama principal (`main`) y la carpeta raíz (`/root`). Guardar y esperar a que GitHub genere la dirección pública. Luego reemplazar este texto por el enlace real:

`https://TU-USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/`

## Pruebas realizadas y pendientes
- Se revisó la estructura de archivos y las rutas relativas utilizadas por las páginas principales.
- Se comprobó que el proyecto incluya un `index.html` en la raíz para GitHub Pages.
- Antes de entregar, probar en navegador: inicio, selección de dificultad, movimiento, salto, puntaje, hitos y pantalla de fin de juego.
- La publicación debe verificarse desde la URL real de GitHub Pages.

## Video de demostración
No incluido en esta versión, según lo solicitado para esta preparación. La consigna original del TP17 sí lo pide como parte de la entrega.

## Licencia
Consultar el archivo `LICENSE` del proyecto base.
