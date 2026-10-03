// ETIESTA shared helpers: WhatsApp number, shared retail cart (localStorage), cart badge
const Etiesta = {
  WA: '6285885332703',
  KEY: 'etiesta_cart_v1',
  load() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch (e) { return []; } },
  save(c) { try { localStorage.setItem(this.KEY, JSON.stringify(c)); } catch (e) {} this.badge(); },
  retail() { return this.load().filter(i => i.type === 'retail'); },
  setRetail(list) { this.save(this.load().filter(i => i.type !== 'retail').concat(list.map(i => ({ ...i, type: 'retail' })))); },
  add(it) {
    const c = this.load(), type = it.type || 'retail';
    const f = c.find(x => x.name === it.name && x.size === it.size && x.type === type);
    if (f) f.qty += it.qty || 1; else c.push({ qty: 1, ...it, type });
    this.save(c);
  },
  count() { return this.load().reduce((a, i) => a + i.qty, 0); },
  badge() {
    const n = this.count();
    document.querySelectorAll('[data-bag-count]').forEach(e => { e.textContent = 'Bag (' + n + ')'; });
  },
  wa(text) { return 'https://wa.me/' + this.WA + '?text=' + encodeURIComponent(text); }
};
document.addEventListener('DOMContentLoaded', () => Etiesta.badge());

// ---- Mobile / Android: hamburger menu + penyesuaian layar kecil ----
(function () {
  const css = `
  html{-webkit-text-size-adjust:100%;text-size-adjust:100%;overflow-x:clip}
  body{overflow-x:clip;-webkit-tap-highlight-color:transparent}
  a,button{touch-action:manipulation}
  img{max-width:100%}
  #mnav-btn{display:none;width:44px;height:44px;align-items:center;justify-content:center;margin-right:-8px}
  #mnav-panel{display:none;position:absolute;top:100%;left:0;right:0;background:#fbf9f5;border-bottom:1px solid #e4e2de;box-shadow:0 12px 24px rgba(0,0,0,.08);max-height:calc(100vh - 5rem);max-height:calc(100dvh - 5rem);overflow-y:auto}
  #mnav-panel a{display:flex;align-items:center;min-height:52px;padding:0 1.25rem;color:#1b1c1a!important;font-size:.8rem;letter-spacing:.15em;text-transform:uppercase;font-weight:500;border-bottom:1px solid #efeeea}
  #mnav-panel a.active{background:#f5f3ef;font-weight:600}
  #site-header.menu-open,#site-header.nav-top.menu-open{background:#fbf9f5!important;backdrop-filter:none!important}
  #site-header.nav-top.menu-open a,#site-header.nav-top.menu-open .material-symbols-outlined,#site-header.nav-top.menu-open [data-bag-count]{color:#1b1c1a!important}
  #site-header.menu-open #mnav-panel{display:block}
  @media(max-width:767px){
    #mnav-btn{display:flex}
    #site-header .rounded-full.bg-primary{display:none}
    #site-header .h-20>div:last-child{gap:.5rem}
    input,select,textarea{font-size:16px!important}
    .font-display-hero{word-break:break-word}
  }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  document.addEventListener('DOMContentLoaded', () => {
    const h = document.querySelector('header'); if (!h) return;
    h.id = 'site-header';
    const nav = h.querySelector('nav'); const right = h.querySelector('.h-20 > div:last-child');
    if (!nav || !right) return;
    const btn = document.createElement('button');
    btn.id = 'mnav-btn'; btn.type = 'button'; btn.setAttribute('aria-label', 'Buka menu'); btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:26px">menu</span>';
    right.appendChild(btn);
    const panel = document.createElement('div'); panel.id = 'mnav-panel';
    nav.querySelectorAll('a').forEach(a => {
      const c = a.cloneNode(true); c.removeAttribute('class');
      if (a.hasAttribute('aria-current')) c.classList.add('active');
      panel.appendChild(c);
    });
    h.appendChild(panel);
    const set = open => {
      h.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', open);
      btn.firstChild.textContent = open ? 'close' : 'menu';
    };
    btn.addEventListener('click', () => set(!h.classList.contains('menu-open')));
    panel.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    window.addEventListener('resize', () => { if (innerWidth >= 768) set(false); });
  });
})();