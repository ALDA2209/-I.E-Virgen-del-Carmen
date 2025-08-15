/* =========================================================
   1) Incluir header/footer con #site-header y #site-footer
========================================================= */
async function include(target, url) {
  const el = document.querySelector(target);
  if (!el) return;
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`No se pudo cargar ${url}`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error('No se pudo incluir:', url, err);
    return;
  }

  // Año en footer
  const y = el.querySelector('#y');
  if (y) y.textContent = new Date().getFullYear();

  // Marcar enlace activo en header
  if (target === '#site-header') {
    const file = location.pathname.split('/').pop() || 'index.html';
    el.querySelectorAll('nav a[href]').forEach(a => {
      const hrefFile = (a.getAttribute('href') || '').split('/').pop();
      a.classList.toggle('active', hrefFile === file);
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const basePath = window.location.pathname.includes('/pages/')
    ? '../components/'
    : 'components/';

  // Cargar header (todas) y footer (solo raíz)
  await include('#site-header', `${basePath}header.html`);
  if (!window.location.pathname.includes('/pages/')) {
    await include('#site-footer', `${basePath}footer.html`);
  }

  /* =========================================================
     2) Header que “acompaña” + color oscuro al bajar
     - Requiere en CSS: body { padding-top: var(--h-header,0); }
       y .encabezado.encima { position:fixed; top:0; left:0; right:0; }
  ========================================================== */
  const headerEl = document.querySelector('header.encabezado.encima');
  if (headerEl) {
    const setH = () => document.body.style.setProperty('--h-header', headerEl.offsetHeight + 'px');
    setH();
    // Si cambia el alto (responsive/menú), recalcular
    if (window.ResizeObserver) {
      new ResizeObserver(setH).observe(headerEl);
    }
  }

  const alDesplazar = () => {
    // Clase en <html> para activar estilos oscuros
    document.documentElement.classList.toggle('desplazado', window.scrollY > 20);
  };
  window.addEventListener('scroll', alDesplazar);
  alDesplazar();

  /* =========================================================
     3) Botón "Conócenos más" (index)
  ========================================================== */
  const btnMas = document.getElementById('btn-mas');
  const descripcionExtra = document.getElementById('descripcion-extra');
  if (btnMas && descripcionExtra) {
    btnMas.addEventListener('click', function () {
      descripcionExtra.classList.toggle('visible');
      this.textContent = descripcionExtra.classList.contains('visible')
        ? 'Mostrar menos'
        : 'Conócenos más';
    });
  }
});

/* =========================================================
   4) Menú móvil (hamburguesa)
========================================================= */
document.addEventListener('click', e => {
  const boton = e.target.closest('.boton-menu');
  if (boton) {
    document.querySelector('.navegacion-principal')
      ?.classList.toggle('navegacion-principal--visible');
  }
});

/* =========================================================
   5) Slider de portada (flechas, autoplay y swipe)
========================================================= */
(function () {
  const portada = document.querySelector('.portada');
  if (!portada) return;

  const diapositivas = [...portada.querySelectorAll('.diapositiva')];
  if (diapositivas.length < 2) return;

  let i = Math.max(0, diapositivas.findIndex(d => d.classList.contains('activa')));
  const mostrar = n => diapositivas.forEach((d, idx) => d.classList.toggle('activa', idx === n));
  const siguiente = () => { i = (i + 1) % diapositivas.length; mostrar(i); };
  const anterior  = () => { i = (i - 1 + diapositivas.length) % diapositivas.length; mostrar(i); };

  mostrar(i);

  portada.querySelector('.flecha-portada--next')?.addEventListener('click', siguiente);
  portada.querySelector('.flecha-portada--prev')?.addEventListener('click', anterior);

  let temporizador = setInterval(siguiente, 5000);
  const reiniciar = () => { clearInterval(temporizador); temporizador = setInterval(siguiente, 5000); };
  portada.addEventListener('mouseenter', () => clearInterval(temporizador));
  portada.addEventListener('mouseleave', reiniciar);

  // Swipe móvil
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
   6) Navegación interna: mantener misma pestaña
========================================================= */
document.addEventListener('click', e => {
  const link = e.target.closest('nav a, .botones-portada a, .intro__texto a');
  if (!link || !link.getAttribute('href')) return;

  const url = link.getAttribute('href');
  // externos o anclas: no interceptar
  if (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('#')) return;

  e.preventDefault();
  window.location.href = url;
});
