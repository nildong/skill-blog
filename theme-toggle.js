(function () {
  'use strict';
  var STORAGE_KEY = 'spg-theme';
  var root = document.documentElement;

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function currentTheme() {
    return root.getAttribute('data-theme') || (systemPrefersDark() ? 'dark' : 'light');
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    updateToggleIcon();
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);

  var style = document.createElement('style');
  style.textContent =
    ':root[data-theme="dark"] body{color:#e8e8e8;background:#121212;}' +
    ':root[data-theme="dark"] a{color:#7cc4ff;}' +
    ':root[data-theme="dark"] .card{background:#1c1c1c !important;}' +
    ':root[data-theme="light"] body{color:#1a1a1a;background:#fff;}' +
    ':root[data-theme="light"] a{color:#d9480f;}' +
    '#spg-theme-toggle{position:fixed;top:14px;right:14px;z-index:9999;width:44px;height:44px;' +
    'border-radius:50%;border:1px solid rgba(128,128,128,.3);cursor:pointer;display:flex;' +
    'align-items:center;justify-content:center;background:rgba(255,255,255,.85);' +
    'box-shadow:0 2px 10px rgba(0,0,0,.2);font-size:20px;line-height:1;padding:0;}' +
    ':root[data-theme="dark"] #spg-theme-toggle{background:rgba(30,30,30,.85);}' +
    '#spg-theme-toggle:hover{filter:brightness(1.08);}' +
    '#spg-back-to-top{display:block;text-align:center;margin:2.5rem 0 1rem;font-size:.95rem;}' +
    '#spg-back-to-top a{text-decoration:none;display:inline-flex;align-items:center;gap:6px;opacity:.8;}' +
    '#spg-back-to-top a:hover{opacity:1;}' +
    '@media (max-width:480px){#spg-theme-toggle{top:10px;right:10px;width:40px;height:40px;font-size:18px;}}';
  document.head.appendChild(style);

  var toggleBtn = document.createElement('button');
  toggleBtn.id = 'spg-theme-toggle';
  toggleBtn.type = 'button';
  toggleBtn.setAttribute('aria-label', 'Alternar entre modo claro e escuro');

  function updateToggleIcon() {
    toggleBtn.textContent = currentTheme() === 'dark' ? '☀️' : '🌙';
  }

  toggleBtn.addEventListener('click', function () {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  });
  updateToggleIcon();

  var backToTop = document.createElement('p');
  backToTop.id = 'spg-back-to-top';
  var backToTopLink = document.createElement('a');
  backToTopLink.href = '#';
  backToTopLink.textContent = '↑ Voltar ao topo';
  backToTopLink.addEventListener('click', function (ev) {
    ev.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  backToTop.appendChild(backToTopLink);

  function mount() {
    document.body.appendChild(toggleBtn);
    document.body.appendChild(backToTop);
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
