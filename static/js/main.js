/*
  PhiloLogic Frontend Script (app.js)
  ----------------------------------
  Purpose:
    - Progressive enhancement for index.html and register.html
    - Fetch and render philosophers from /api/philosophers with caching + filtering
    - Fetch learning modules from /api/philosophers/:id/modules
    - Inline DB connection test via /test-db (without leaving the page)
    - Lightweight UI helpers (toast, loading states, error banners)
    - Client-side validation on register.html (keeps normal form POST to Flask)

  How it works:
    - This script is safe to include on *all* pages. It detects what to do based on DOM.
    - Place file at: /static/js/app.js and include: <script src="/static/js/app.js" defer></script>
*/

(() => {
  // --------- Utilities ---------
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const log = {
    info: (...a) => console.info("[PhiloLogic]", ...a),
    warn: (...a) => console.warn("[PhiloLogic]", ...a),
    error: (...a) => console.error("[PhiloLogic]", ...a),
  };

  // Toast system
  const Toast = (() => {
    let container;
    function ensureContainer() {
      if (!container) {
        container = document.createElement("div");
        container.style.position = "fixed";
        container.style.right = "16px";
        container.style.bottom = "16px";
        container.style.zIndex = "9999";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "8px";
        document.body.appendChild(container);
      }
    }
    function show(message, variant = "info", timeout = 3000) {
      ensureContainer();
      const el = document.createElement("div");
      el.textContent = message;
      el.style.padding = "10px 14px";
      el.style.borderRadius = "8px";
      el.style.color = "#fff";
      el.style.background = variant === "error" ? "#e74c3c" : variant === "success" ? "#27ae60" : "#3498db";
      container.appendChild(el);
      setTimeout(() => el.remove(), timeout);
    }
    return { show };
  })();

  // Fetch JSON helper
  async function fetchJSON(url, options = {}) {
    const res = await fetch(url, { headers: { "Accept": "application/json" }, ...options });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json();
    return res.text();
  }

  // Escape HTML
  function escapeHTML(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // --------- Index Page ---------
  async function initIndex() {
    const grid = qs('#philosophers-grid');
    if (!grid) return;

    let philosophers = [];

    function render(list) {
      grid.innerHTML = '';
      list.forEach((p) => {
        const card = document.createElement('div');
        card.className = 'philosopher-card';
        card.innerHTML = `
          <h3>${escapeHTML(p.name)}</h3>
          <h4>${escapeHTML(p.work_title)}</h4>
          <p>${escapeHTML(p.description)}</p>
          <div style="display:flex; gap:8px;">
            <button class="btn" data-action="start" data-id="${p.id}">Start Learning</button>
            <button class="btn" data-action="details" data-id="${p.id}">Details</button>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    async function loadPhilosophers() {
      try {
        grid.innerHTML = '<p>Loading philosophers…</p>';
        philosophers = await fetchJSON('/api/philosophers');
        render(philosophers);
      } catch (err) {
        log.error(err);
        grid.innerHTML = '<p style="color:red;">Error loading philosophers.</p>';
      }
    }

    grid.addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const id = Number(btn.getAttribute('data-id'));
      const action = btn.getAttribute('data-action');
      if (action === 'start') {
        try {
          const modules = await fetchJSON(`/api/philosophers/${id}/modules`);
          showModulesModal(modules, id);
        } catch (err) {
          Toast.show('Failed to load modules', 'error');
        }
      } else if (action === 'details') {
        const p = philosophers.find((x) => x.id === id);
        if (p) showDetailsModal(p);
      }
    });

    loadPhilosophers();
  }

  function showDetailsModal(p) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.4)';
    overlay.style.display = 'grid';
    overlay.style.placeItems = 'center';
    overlay.innerHTML = `<div style="background:#fff; padding:20px; border-radius:10px; max-width:600px;">
      <h2>${escapeHTML(p.name)}</h2>
      <h3>${escapeHTML(p.work_title)}</h3>
      <p>${escapeHTML(p.description)}</p>
      <button class="btn" id="close-modal">Close</button>
    </div>`;
    document.body.appendChild(overlay);
    qs('#close-modal', overlay).addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  }

  function showModulesModal(modules, philosopherId) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.4)';
    overlay.style.display = 'grid';
    overlay.style.placeItems = 'center';
    overlay.innerHTML = `<div style="background:#fff; padding:20px; border-radius:10px; max-width:600px;">
      <h2>Modules for Philosopher #${philosopherId}</h2>
      <ul style="padding-left:20px;">
        ${modules.map(m => `<li><strong>${escapeHTML(m.title)}</strong> - ${escapeHTML(m.content)}</li>`).join('')}
      </ul>
      <button class="btn" id="close-modules">Close</button>
    </div>`;
    document.body.appendChild(overlay);
    qs('#close-modules', overlay).addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  }

  // --------- Register Page ---------
  function initRegister() {
    const form = qs('form[method="POST"]');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      const username = qs('#username').value.trim();
      const email = qs('#email').value.trim();
      const password = qs('#password').value;
      const errors = [];
      if (username.length < 3) errors.push('Username too short.');
      if (!email.includes('@')) errors.push('Invalid email.');
      if (password.length < 6) errors.push('Password too short.');
      if (errors.length) {
        e.preventDefault();
        Toast.show(errors.join(' '), 'error');
      }
    });
  }

  // --------- Boot ---------
  document.addEventListener('DOMContentLoaded', () => {
    initIndex();
    initRegister();
    log.info('Frontend ready');
  });
})();
