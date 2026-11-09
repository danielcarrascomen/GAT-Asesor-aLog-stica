(() => {
  // Para recibir solicitudes sin abrir el correo, pega aquí la URL de un servicio de formularios.
  const ENDPOINT = '';
  const EMAIL = 'ventas@gatsc.com';
  const T = s => (window.gatT ? gatT(s) : s);
  const radios = (name, items) => items.map((v, i) =>
    `<label class="pill"><input type="radio" name="${name}" value="${v}" ${i ? '' : 'checked'}><span>${v}</span></label>`).join('');
  const options = items => items.map(v => `<option>${v}</option>`).join('');
  const d = document.createElement('dialog');
  d.className = 'qd'; d.setAttribute('aria-labelledby', 'qdTitle'); d.setAttribute('data-lenis-prevent', '');
  d.innerHTML = `
  <div class="qd-top"><h2 id="qdTitle">Solicitar una cotización</h2><button type="button" class="qd-x" aria-label="Cerrar">×</button></div>
  <div class="qd-bar" aria-hidden="true"><i></i></div>
  <p class="qd-step" id="qdStep" aria-live="polite"></p>
  <form id="qdForm" novalidate>
    <section data-s="Tu operación">
      <fieldset><legend>Tipo de operación</legend>${radios('Operación', ['Importación', 'Exportación'])}</fieldset>
      <fieldset><legend>Transporte</legend>${radios('Transporte', ['Marítimo', 'Terrestre', 'Aéreo'])}</fieldset>
      <label>Servicio que necesitas<select name="Servicio">${options(['Despacho aduanal', 'Asesoría en comercio exterior', 'Auditoría de operaciones', 'Seguro de mercancías', 'Programas y permisos', 'Capacitación', 'Otro'])}</select></label>
    </section>
    <section data-s="Tu carga" hidden>
      <label>Mercancía<input name="Mercancía" required placeholder="Ej. refacciones industriales"></label>
      <div class="qd-2"><label>Origen<input name="Origen" required placeholder="País o ciudad"></label><label>Destino<input name="Destino" required placeholder="País o ciudad"></label></div>
      <label>Aduana de preferencia<select name="Aduana">${options(['No estoy seguro', 'Manzanillo', 'Lázaro Cárdenas', 'Veracruz', 'AICM, Ciudad de México', 'Altamira', 'Nuevo Laredo', 'Colombia, N.L.'])}</select></label>
      <fieldset><legend>Frecuencia</legend>${radios('Frecuencia', ['Una vez', 'Mensual', 'Varias al mes'])}</fieldset>
    </section>
    <section data-s="Tus datos" hidden>
      <div class="qd-2"><label>Nombre<input name="Nombre" required autocomplete="name"></label><label>Empresa<input name="Empresa" required autocomplete="organization"></label></div>
      <div class="qd-2"><label>Correo<input name="Correo" type="email" required autocomplete="email"></label><label>Teléfono<input name="Teléfono" type="tel" required autocomplete="tel"></label></div>
      <label>Comentarios (opcional)<textarea name="Comentarios" rows="3"></textarea></label>
      <label class="qd-ok"><input type="checkbox" name="consent" required><span>Acepto el uso de mis datos para responder esta solicitud, según el <a href="privacidad.html" target="_blank">aviso de privacidad</a>.</span></label>
    </section>
    <p class="qd-err" id="qdErr" role="alert" hidden></p>
    <div class="qd-nav"><button type="button" class="btn btn-line" id="qdBack">Atrás</button><button type="submit" class="btn btn-solid" id="qdNext">Continuar</button></div>
  </form>
  <div class="qd-done" id="qdDone" hidden><h3 id="qdDoneT"></h3><p id="qdDoneP"></p><p class="qd-alt">¿Prefieres llamar? <a href="tel:+525525872033">+52 55 2587 2033</a></p><button type="button" class="btn btn-solid" id="qdClose">Cerrar</button></div>`;
  document.body.append(d);
  if (window.gatTranslate) gatTranslate(d);

  const $ = id => d.querySelector('#' + id);
  const form = $('qdForm'), steps = [...form.querySelectorAll('section')], bar = d.querySelector('.qd-bar i');
  let i = 0;
  const show = () => {
    steps.forEach((s, n) => s.hidden = n !== i);
    $('qdStep').textContent = T('Paso') + ` ${i + 1} ` + T('de') + ` ${steps.length}: ` + T(steps[i].dataset.s);
    bar.style.width = ((i + 1) / steps.length * 100) + '%';
    $('qdBack').style.visibility = i ? 'visible' : 'hidden';
    $('qdNext').textContent = i === steps.length - 1 ? T('Enviar solicitud') : T('Continuar');
    $('qdErr').hidden = true;
    d.scrollTop = 0;
  };
  const open = () => {
    form.hidden = false; $('qdDone').hidden = true; d.querySelector('.qd-bar').hidden = false; $('qdStep').hidden = false;
    i = 0; show(); d.showModal(); window.gatLenis && window.gatLenis.stop();
  };
  const close = () => d.close();
  d.addEventListener('close', () => window.gatLenis && window.gatLenis.start());
  d.querySelector('.qd-x').onclick = close; $('qdClose').onclick = close;
  d.addEventListener('click', e => { if (e.target === d) close(); });
  $('qdBack').onclick = () => { if (i) { i--; show(); } };

  const valid = () => {
    const bad = [...steps[i].querySelectorAll('input,textarea,select')].find(f => !f.checkValidity());
    if (!bad) return true;
    const name = bad.type === 'checkbox' ? T('Acepta el aviso de privacidad para continuar.')
      : bad.type === 'email' && bad.value ? T('Escribe un correo válido.') : T('Completa el campo') + ` ${T(bad.name)}.`;
    $('qdErr').textContent = name; $('qdErr').hidden = false; bad.focus();
    return false;
  };
  const finish = (t, p) => {
    form.hidden = true; d.querySelector('.qd-bar').hidden = true; $('qdStep').hidden = true;
    $('qdDoneT').textContent = t; $('qdDoneP').textContent = p; $('qdDone').hidden = false; form.reset();
  };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!valid()) return;
    if (i < steps.length - 1) { i++; show(); return; }
    const data = [...new FormData(form)].filter(([k, v]) => k !== 'consent' && v);
    if (ENDPOINT) {
      const b = $('qdNext'); b.disabled = true; b.textContent = T('Enviando');
      try {
        const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.fromEntries(data)) });
        if (!r.ok) throw 0;
        b.disabled = false;
        finish(T('Solicitud enviada'), T('Un asesor de GAT te contactará con los datos que compartiste.'));
      } catch {
        b.disabled = false; b.textContent = T('Enviar solicitud');
        $('qdErr').textContent = T('No se pudo enviar. Inténtalo de nuevo o escribe a') + ` ${EMAIL}.`; $('qdErr').hidden = false;
      }
      return;
    }
    const body = data.map(([k, v]) => `${k}: ${v}`).join('\n');
    const empresa = data.find(([k]) => k === 'Empresa')[1];
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Solicitud de cotización: ' + empresa)}&body=${encodeURIComponent(body)}`;
    finish(T('Tu solicitud está lista'), T('Se abrió tu correo con la información. Envía el mensaje para que llegue a GAT.'));
  });

  window.gatQuote = email => { open(); if (email) form.querySelector('[name="Correo"]').value = email; };

  // Todos los botones de cotizar abren el formulario
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href$="#cotizar"]');
    if (!a) return;
    e.preventDefault(); e.stopPropagation(); open();
  }, true);
})();
