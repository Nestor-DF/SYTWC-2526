// src/components/app-shell.js
import './canary-space.js';
import './space-ratings.js';

export class AppShell extends HTMLElement {
    constructor() {
        super();
        this._onDias = this._onDias.bind(this);
    }

    connectedCallback() {
        // cargar datos y pintar tarjetas
        this.#init();
        // escuchar evento global de días
        this.addEventListener('dias-actualizados', this._onDias);
    }

    disconnectedCallback() {
        this.removeEventListener('dias-actualizados', this._onDias);
    }

    async #init() {
        try {
            const spaces = await fetch('/data/spaces.json').then(r => r.json());

            // Ejemplo: muestra los 3 con mejor valoración (o todos, si prefieres)
            const top3 = [...spaces].sort((a, b) => b.valoracionMedia - a.valoracionMedia).slice(0, 3);

            // Render de tarjetas
            this.innerHTML = '';
            top3.forEach(s => {
                const card = document.createElement('canary-space');
                card.setAttribute('espacio-id', s.id);
                this.appendChild(card);
            });

            // Añadimos el micro-frontend de valoraciones (una vez)
            const ratings = document.createElement('space-ratings');
            ratings.style.gridColumn = '1 / -1'; // que ocupe ancho completo al final
            this.appendChild(ratings);

        } catch (err) {
            this.innerHTML = `<p style="color:crimson">No se pudieron cargar los espacios.</p>`;
            console.error(err);
        }
    }

    _onDias(e) {
        // Actualiza el header global con el último valor recibido
        const dias = e.detail?.dias ?? '—';
        const el = document.querySelector('#diasHeader');
        if (el) el.textContent = `Días desde la última visita: ${dias}`;
    }
}

customElements.define('app-shell', AppShell);
