(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const signal = document.getElementById('signal');
  if (reduced || !window.gsap) { signal.classList.add('go'); }
  else {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo('.truck', { xPercent: -105 }, { x: () => innerWidth, xPercent: -18, ease: 'none', scrollTrigger: { trigger: '.haul-pin', start: 'top 85%', end: 'bottom 20%', scrub: true, invalidateOnRefresh: true } });
    gsap.fromTo('.haul-word', { x: 0 }, { x: () => -(document.querySelector('.haul-word').offsetWidth - innerWidth), ease: 'none', scrollTrigger: { trigger: '.haul-pin', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
    gsap.fromTo('.hero-box', { yPercent: 0 }, { yPercent: -42, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    ScrollTrigger.create({ trigger: '#stepSignal', start: 'top 62%', end: 'top 34%',
      onEnter: () => signal.className = 'signal stop', onLeave: () => signal.className = 'signal go',
      onEnterBack: () => signal.className = 'signal stop', onLeaveBack: () => signal.className = 'signal' });
    const v = document.querySelector('.vias'), t = document.querySelector('.vias-track');
    v.classList.add('on');
    gsap.to(t, { x: () => -(t.scrollWidth - innerWidth), ease: 'none', scrollTrigger: { trigger: v, pin: true, start: 'top top', end: () => '+=' + (t.scrollWidth - innerWidth), scrub: 0.6, invalidateOnRefresh: true } });
    gsap.fromTo('.strip-t', { x: 0 }, { x: () => -(document.querySelector('.strip-t').scrollWidth - innerWidth), ease: 'none', scrollTrigger: { trigger: '.strip', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
    addEventListener('load', () => ScrollTrigger.refresh());
  }
  const tabs = [...document.querySelectorAll('.tabs button')];
  const panel = document.getElementById('modePanel');
  const select = t => {
    tabs.forEach(b => { b.setAttribute('aria-selected', b === t); b.tabIndex = b === t ? 0 : -1; });
    panel.src = t.dataset.img; panel.alt = t.dataset.alt;
    document.getElementById('modeText').textContent = window.gatT ? gatT(t.dataset.text) : t.dataset.text;
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; select(n); n.focus(); }
    });
  });
  document.getElementById('heroForm').addEventListener('submit', e => { e.preventDefault(); window.gatQuote(document.getElementById('heroEmail').value); });
})();
