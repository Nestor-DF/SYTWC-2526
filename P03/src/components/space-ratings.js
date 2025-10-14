// src/components/space-ratings.js
export class SpaceRatings extends HTMLElement {
    constructor() {
        super();
        console.log('[space-ratings] constructor → Creado');
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; padding:12px; border:1px dashed #cbd5e1; border-radius:10px; background:#f8fafc; }
        h4 { margin:0 0 .5rem; }
        .item { padding:.5rem 0; border-bottom:1px solid #e5e7eb; }
        .item:last-child { border-bottom:0; }
        .score { font-weight:700; }
        .muted { opacity:.75; }
      </style>
      <h4>Valoraciones</h4>
      <div class="list muted">Pulsa “Mostrar valoraciones” en una tarjeta…</div>
    `;
        this._handle = this._handle.bind(this);
    }

    connectedCallback() {
        console.log('[space-ratings] connectedCallback → Adjuntado al DOM');
        document.addEventListener('espacio-valoraciones', this._handle);
    }

    disconnectedCallback() {
        console.log('[space-ratings] disconnectedCallback → Separado del DOM');
        document.removeEventListener('espacio-valoraciones', this._handle);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('[space-ratings] attributeChangedCallback', { name, oldValue, newValue });
    }

    static get observedAttributes() { return []; }

    async _handle(e) {
        const { espacioId } = e.detail;
        await this.#cargarValoraciones(espacioId);
    }

    async #cargarValoraciones(id) {
        const cont = this.shadowRoot.querySelector('.list');
        cont.textContent = 'Cargando valoraciones…';
        try {
            const all = await fetch('/data/ratings.json').then(r => r.json());
            const list = all[id] ?? [];

            if (!list.length) {
                cont.innerHTML = `<div class="muted">Este espacio aún no tiene valoraciones simuladas.</div>`;
                return;
            }
            cont.innerHTML = list.map(v => `
        <div class="item">
          <div><span class="score">⭐ ${v.puntuacion}</span> — ${v.usuario}</div>
          <div>${v.comentario}</div>
        </div>
      `).join('');
        } catch (err) {
            cont.innerHTML = `<div style="color:crimson">Error cargando valoraciones.</div>`;
            console.error(err);
        }
    }
}

customElements.define('space-ratings', SpaceRatings);
