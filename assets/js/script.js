/* =========================================================
   Utilidades: cargar fragmentos (header/footer) con data-include
========================================================= */
document.querySelectorAll('[data-include]').forEach(async el => {
  try {
    const res = await fetch(el.getAttribute('data-include'));
    el.outerHTML = await res.text();
  } catch (e) {
    console.warn('No se pudo incluir:', e);
  }
});

/* =========================================================
   Menú móvil (hamburguesa)
========================================================= */
document.addEventListener('click', e => {
  const boton = e.target.closest('.boton-menu');
  if (boton) {
    document.querySelector('.navegacion-principal')
      ?.classList.toggle('navegacion-principal--visible');
  }
});

/* =========================================================
   Encabezado sólido al desplazar (cambia color/fondo)
========================================================= */
const alDesplazar = () => {
  document.documentElement.classList.toggle('desplazado', window.scrollY > 20);
};
window.addEventListener('scroll', alDesplazar);
alDesplazar();

/* =========================================================
   Slider de portada (diapositivas con flechas, autoplay y swipe)
========================================================= */
(function () {
  const portada = document.querySelector('.portada');
  if (!portada) return;

  const diapositivas = [...portada.querySelectorAll('.diapositiva')];
  if (diapositivas.length < 2) return;

  let i = Math.max(0, diapositivas.findIndex(d => d.classList.contains('activa')));
  const mostrar = n => diapositivas.forEach((d, idx) => d.classList.toggle('activa', idx === n));
  const siguiente = () => { i = (i + 1) % diapositivas.length; mostrar(i); };
  const anterior = () => { i = (i - 1 + diapositivas.length) % diapositivas.length; mostrar(i); };

  mostrar(i);

  portada.querySelector('.flecha-portada--next')?.addEventListener('click', siguiente);
  portada.querySelector('.flecha-portada--prev')?.addEventListener('click', anterior);

  let temporizador = setInterval(siguiente, 5000);
  const reiniciar = () => { clearInterval(temporizador); temporizador = setInterval(siguiente, 5000); };
  portada.addEventListener('mouseenter', () => clearInterval(temporizador));
  portada.addEventListener('mouseleave', reiniciar);

  // Deslizar en móvil
  let x0 = null;
  portada.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
  portada.addEventListener('touchend', e => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) (dx > 0 ? anterior() : siguiente());
    reiniciar(); x0 = null;
  }, { passive: true });
})();

/* =========================================================
   Cargar footer dinámicamente
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  fetch("components/footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer-placeholder").innerHTML = data;
    })
    .catch(error => console.error("Error cargando el footer:", error));
});

/* =========================================================
   Enlaces del menú: cambiar ruta en misma pestaña
========================================================= */
document.addEventListener("click", e => {
  const link = e.target.closest("nav a, .botones-portada a, .intro__texto a");
  if (link && link.getAttribute("href")) {
    const url = link.getAttribute("href");

    // Si el enlace es externo, no lo interceptamos
    if (url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("#")) return;

    e.preventDefault();
    window.location.href = url; // Cambia la ruta en la misma pestaña
  }
});
document.getElementById("btn-mas").addEventListener("click", function() {
  const extra = document.getElementById("descripcion-extra");
  extra.classList.toggle("activo");

  if (extra.classList.contains("activo")) {
    this.textContent = "Mostrar menos";
  } else {
    this.textContent = "Conócenos más";
  }
});
document.addEventListener("DOMContentLoaded", function() {
  const btnMas = document.getElementById("btn-mas");
  const descripcionExtra = document.getElementById("descripcion-extra");

  btnMas.addEventListener("click", function() {
    descripcionExtra.classList.toggle("visible");
    
    if (descripcionExtra.classList.contains("visible")) {
      btnMas.textContent = "Mostrar menos";
    } else {
      btnMas.textContent = "Conócenos más";
    }
  });
});

