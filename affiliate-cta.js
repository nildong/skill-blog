/* CTA de afiliado: barra fixa no mobile + evento GA4 affiliate_click por posição. */
(function () {
  var AFF = 'a[href*="meli.la"], a[href*="mercadolivre.com"]';

  function position(a) {
    var tagged = a.closest('[data-cta]');
    if (tagged) return tagged.getAttribute('data-cta');
    if (a.closest('.cta-box')) return 'final';
    return 'inline';
  }

  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest(AFF);
    if (!a || typeof gtag !== 'function') return;
    gtag('event', 'affiliate_click', {
      cta_position: position(a),
      link_url: a.href,
      page_path: location.pathname,
      transport_type: 'beacon'
    });
  });

  var top = document.querySelector('[data-cta="top"] a');
  if (!top || !('IntersectionObserver' in window)) return;
  try { if (sessionStorage.getItem('spg-cta-bar-closed')) return; } catch (e) {}

  var jump = top.getAttribute('href').charAt(0) === '#';
  var style = document.createElement('style');
  style.textContent =
    '.cta-bar{position:fixed;left:0;right:0;bottom:0;z-index:50;display:none;align-items:center;gap:10px;' +
    'padding:10px 12px calc(10px + env(safe-area-inset-bottom));background:#fff;border-top:1px solid rgba(0,0,0,.12);' +
    'box-shadow:0 -6px 18px rgba(0,0,0,.12);transform:translateY(110%);transition:transform .25s ease;}' +
    '.cta-bar.show{transform:none;}' +
    '.cta-bar a.cta-bar-btn{flex:1;text-align:center;background:#b23a0d;color:#fff !important;font-weight:700;' +
    'padding:12px 14px;border-radius:12px;text-decoration:none;font-size:.98rem;}' +
    '.cta-bar button{background:none;border:0;font-size:1.4rem;line-height:1;padding:6px 8px;color:inherit;opacity:.6;cursor:pointer;}' +
    '@media (max-width:768px){.cta-bar{display:flex;}}' +
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .cta-bar{background:#1c1c1c;color:#e8e8e8;border-top-color:rgba(255,255,255,.12);}}' +
    ':root[data-theme="dark"] .cta-bar{background:#1c1c1c;color:#e8e8e8;border-top-color:rgba(255,255,255,.12);}';
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.className = 'cta-bar';
  bar.setAttribute('data-cta', 'sticky');
  var link = document.createElement('a');
  link.className = 'cta-bar-btn';
  link.href = top.getAttribute('href');
  link.textContent = jump ? 'Ver os produtos recomendados ↓' : 'Ver preço no Mercado Livre →';
  if (!jump) { link.target = '_blank'; link.rel = 'nofollow sponsored noopener'; }
  var close = document.createElement('button');
  close.type = 'button';
  close.setAttribute('aria-label', 'Fechar');
  close.textContent = '×';
  close.addEventListener('click', function () {
    bar.remove();
    try { sessionStorage.setItem('spg-cta-bar-closed', '1'); } catch (e) {}
  });
  bar.appendChild(link);
  bar.appendChild(close);
  document.body.appendChild(bar);

  // Mostra depois que o CTA do topo sai da tela; esconde quando o CTA final (ou a área de produtos) aparece.
  var pastTop = false, endVisible = false, reached = false;
  function update() { bar.classList.toggle('show', pastTop && !endVisible && !reached); }
  new IntersectionObserver(function (e) {
    pastTop = !e[0].isIntersecting && e[0].boundingClientRect.top < 0;
    update();
  }).observe(top.closest('[data-cta]'));
  if (jump) {
    // Em comparativos, a barra só leva até a seção de produtos; depois dela, some.
    var target = document.querySelector(link.getAttribute('href'));
    if (target) new IntersectionObserver(function (e) {
      reached = e[0].isIntersecting || e[0].boundingClientRect.top < 0;
      update();
    }).observe(target);
  }
  var ends = document.querySelectorAll('.cta-box, footer');
  var seen = new Set();
  var endObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      en.isIntersecting || en.boundingClientRect.top < 0 ? seen.add(en.target) : seen.delete(en.target);
    });
    endVisible = seen.size > 0;
    update();
  });
  [].forEach.call(ends, function (el) { endObs.observe(el); });
})();
