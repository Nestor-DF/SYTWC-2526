import './canary-space.js';
import './space-ratings.js';

export class AppShell extends HTMLElement {
    constructor() {
        super();
        this._onDias = this._onDias.bind(this);
    }

    connectedCallback() {
        this.#init();
        this.addEventListener('dias-actualizados', this._onDias);
    }

    disconnectedCallback() {
        this.removeEventListener('dias-actualizados', this._onDias);
    }

    async #init() {
        try {
            const spaces = await fetch('/data/espacios-culturales.json').then(r => r.json());

            const top3 = [...spaces].sort((a, b) => b.valoracionMedia - a.valoracionMedia).slice(0, 3);

            this.innerHTML = '';
            top3.forEach(s => {
                const card = document.createElement('canary-space');
                card.setAttribute('espacio-id', s.id);
                this.appendChild(card);
            });

            const ratings = document.createElement('space-ratings');
            ratings.style.gridColumn = '1 / -1';
            this.appendChild(ratings);

        } catch (err) {
            this.innerHTML = `<p style="color:crimson">No se pudieron cargar los espacios.</p>`;
            console.error(err);
        }
    }

    _onDias(e) {
        const dias = e.detail?.dias ?? '—';
        const el = document.querySelector('#diasHeader');
        if (el) el.textContent = `Días desde la última visita: ${dias}`;
    }
}

customElements.define('app-shell', AppShell);
