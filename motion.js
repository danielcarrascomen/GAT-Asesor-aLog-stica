(() => {
  if (!window.gsap || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);
  const $ = (s, r = document) => [...r.querySelectorAll(s)];

  // Encabezado transparente sobre el hero
  const nav = document.querySelector('.nav');
  if (!document.querySelector('.legal')) {
    const top = () => nav.classList.toggle('at-top', scrollY < 40);
    top(); addEventListener('scroll', top, { passive: true });
  }

  // Scroll suave
  document.documentElement.style.scrollBehavior = 'auto';
  const lenis = window.Lenis ? new Lenis({ lerp: 0.11, smoothWheel: true }) : null;
  window.gatLenis = lenis;
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href').length < 2) return;
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -72, duration: 1.4 }); }
    });
  }

  // Divide un texto en palabras conservando el contenido para lectores de pantalla
  const words = (el, inner) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w =>
      inner ? `<span class="w"><span class="wi">${w}</span></span>` : `<span class="wf">${w}</span>`
    ).join(' ');
  };

  // Entrada de la página: un solo gesto en el titular principal
  $('h1').forEach(h => {
    words(h, true);
    gsap.fromTo($('.wi', h), { yPercent: 115 }, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.06, delay: 0.15 });
  });

  // Títulos: las palabras suben al entrar
  $('main h2').forEach(h => {
    if (h.closest('.why') || h.closest('.legal') || h.closest('.via')) return;
    words(h, true);
    gsap.fromTo($('.wi', h), { yPercent: 115 }, {
      yPercent: 0, duration: 0.95, ease: 'power3.out', stagger: 0.035,
      scrollTrigger: { trigger: h, start: 'top 88%', once: true }
    });
  });

  // Frases que se iluminan con el scroll
  $('.why h2, .why-lead, .extra').forEach(el => {
    if (el.querySelector('strong')) { el.querySelector('strong').outerHTML = el.querySelector('strong').textContent; }
    words(el, false);
    gsap.fromTo($('.wf', el), { opacity: 0.18 }, {
      opacity: 1, stagger: 0.05, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 45%', scrub: true }
    });
  });

  // Fotos que se abren
  $('.svc-grid img, .rel img').forEach(img => {
    gsap.fromTo(img, { clipPath: 'inset(0 0 100% 0)' }, {
      clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power3.inOut',
      scrollTrigger: { trigger: img, start: 'top 90%', once: true }
    });
  });

  // El puerto se expande hasta ocupar la pantalla
  const why = document.querySelector('.why-bg');
  if (why) gsap.fromTo(why, { clipPath: 'inset(14% 20%)', scale: 1.16 }, {
    clipPath: 'inset(0% 0%)', scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.why', start: 'top 95%', end: 'top 15%', scrub: true }
  });

  // Listas que entran en secuencia
  $('.clients ul').forEach(list => {
    gsap.from(list.children, {
      opacity: 0, y: 26, duration: 0.7, ease: 'power2.out', stagger: 0.06,
      scrollTrigger: { trigger: list, start: 'top 82%', once: true }
    });
  });

  // Mapa: las rutas salen de México al entrar
  const arcs = $('.arc');
  if (arcs.length) {
    gsap.fromTo(arcs, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: 0.14, scrollTrigger: { trigger: '.net-map', start: 'top 72%', once: true } });
    gsap.from('.end, .net-map text', { opacity: 0, duration: 0.5, delay: 1.1, stagger: 0.05, scrollTrigger: { trigger: '.net-map', start: 'top 72%', once: true } });
  }

  // Cifras
  $('.fig strong').forEach(el => {
    const raw = el.textContent.trim(), n = parseInt(raw.replace(/\D/g, ''), 10), o = { v: 0 };
    el.textContent = '0+';
    gsap.to(o, {
      v: n, duration: 1.8, ease: 'power2.out',
      onUpdate: () => el.textContent = Math.round(o.v).toLocaleString('en-US') + '+',
      scrollTrigger: { trigger: '.figures', start: 'top 80%', once: true }
    });
  });

  // Carretera: etapa actual y vuelta final del camión
  const num = document.getElementById('stageNum');
  if (num) $('.steps li').forEach((li, i) => ScrollTrigger.create({
    trigger: li, start: 'top 62%', end: 'bottom 62%',
    onToggle: s => { if (s.isActive) num.textContent = i + 1; }
  }));
  const truck = document.getElementById('truckTop');
  if (truck) {
    const road = () => document.querySelector('.route-road').offsetWidth;
    gsap.fromTo(truck, { x: 0, y: 0, rotation: 0 }, {
      keyframes: [
        { rotation: 90, x: () => road() * 0.7, y: () => truck.offsetHeight / 2 - road() / 2, ease: 'power1.inOut', duration: 0.5 },
        { x: () => innerWidth, ease: 'power1.in', duration: 0.5 }
      ],
      scrollTrigger: { trigger: '.route', start: 'bottom 100%', end: 'bottom 38%', scrub: 0.4, invalidateOnRefresh: true }
    });
  }

  // Cursor con avance de lectura
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const c = document.createElement('div');
    c.className = 'cursor'; c.setAttribute('aria-hidden', 'true');
    c.innerHTML = '<svg viewBox="0 0 64 64"><circle class="t" cx="32" cy="32" r="30"/><circle class="p" cx="32" cy="32" r="30" pathLength="100"/></svg><i></i>';
    document.body.append(c);
    gsap.set(c, { xPercent: -50, yPercent: -50, opacity: 0 });
    const x = gsap.quickTo(c, 'x', { duration: 0.28, ease: 'power3' });
    const y = gsap.quickTo(c, 'y', { duration: 0.28, ease: 'power3' });
    addEventListener('mousemove', e => { x(e.clientX); y(e.clientY); gsap.to(c, { opacity: 1, duration: 0.2, overwrite: 'auto' }); });
    document.addEventListener('mouseover', e => c.classList.toggle('on', !!e.target.closest('a,button,summary,label')));
    const p = c.querySelector('.p');
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => p.style.strokeDashoffset = 100 - s.progress * 100 });
  }

  // Resalta cada aduana en el mapa
  $('.net-card li').forEach(li => {
    const ad = document.querySelector(`.ad[data-a="${li.dataset.a}"]`);
    li.addEventListener('mouseenter', () => ad.classList.add('hot'));
    li.addEventListener('mouseleave', () => ad.classList.remove('hot'));
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
