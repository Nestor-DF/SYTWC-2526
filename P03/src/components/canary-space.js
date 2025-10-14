const TEMPLATE_URL = '/templates/space.html';

export class CanarySpace extends HTMLElement {
    static get observedAttributes() {
        // atributos de entrada: id del espacio y si mostrar valoraciones
        return ['espacio-id', 'mostrar-valoraciones'];
    }

    #shadow;
    #data = null;  // datos del espacio cargados
    #templateLoaded = false;

    constructor() {
        super();
        console.log('[canary-space] constructor → Creado');
        this.#shadow = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        console.log('[canary-space] connectedCallback → Adjuntado al DOM');

        // 1) Cargar plantilla externa (solo una vez por instancia)
        if (!this.#templateLoaded) {
            const html = await fetch(TEMPLATE_URL).then(r => r.text());
            const tpl = document.createElement('template');
            tpl.innerHTML = html.trim();
            const node = tpl.content.querySelector('#card-space').content.cloneNode(true);
            this.#shadow.appendChild(node);
            this.#templateLoaded = true;

            // wire up listeners del botón
            this.#shadow.querySelector('.btn-valoraciones')
                .addEventListener('click', () => this.#emitirPeticionValoraciones());
        }

        // 2) Cargar datos del espacio si hay atributo
        const id = this.getAttribute('espacio-id');
        if (id) await this.#cargarEspacio(id);

        // 3) Si está pedido mostrar valoraciones por atributo, emite evento
        if (this.hasAttribute('mostrar-valoraciones')) {
            this.#emitirPeticionValoraciones();
        }
    }

    disconnectedCallback() {
        console.log('[canary-space] disconnectedCallback → Separado del DOM');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`[canary-space] attributeChangedCallback (${name}):`, { oldValue, newValue });

        if (name === 'espacio-id' && newValue && newValue !== oldValue) {
            // si cambian el id, recargamos la tarjeta
            this.#cargarEspacio(newValue);
        }

        if (name === 'mostrar-valoraciones' && this.#templateLoaded) {
            // si togglean el atributo, emite el evento
            this.#emitirPeticionValoraciones();
        }
    }

    async #cargarEspacio(id) {
        try {
            // Simula API (puedes sustituir por MockAPI/Beeceptor)
            const spaces = await fetch('/data/spaces.json').then(r => r.json());
            const espacio = spaces.find(e => e.id === id);
            if (!espacio) throw new Error('Espacio no encontrado');

            this.#data = espacio;
            this.#pintar();

            // Al pintar, recalculamos días y emitimos evento (Ejercicio 4)
            this.#emitirDiasTranscurridos();
        } catch (err) {
            console.error('Error cargando espacio:', err);
            // this.#renderError('No se pudo cargar el espacio.');
        }
    }

    #pintar() {
        const $ = sel => this.#shadow.querySelector(sel);
        const d = this.#data;

        $('.img').src = d.imagen;
        $('.img').alt = `Imagen de ${d.nombre}`;
        $('.nombre').textContent = d.nombre;
        $('.ubicacion').textContent = `Ubicación: ${d.ubicacion}`;
        $('.fecha').textContent = `Fecha de visita: ${d.fechaVisita}`;
        $('.rating').textContent = `⭐ ${d.valoracionMedia.toFixed(1)}`;
    }

    #renderError(msg) {
        this.#shadow.innerHTML = `<p style="padding:1rem;color:crimson">${msg}</p>`;
    }

    #emitirPeticionValoraciones() {
        if (!this.#data?.id) return;
        // Evento personalizado para que otro componente (valoraciones) reaccione
        this.dispatchEvent(new CustomEvent('espacio-valoraciones', {
            detail: { espacioId: this.#data.id },
            bubbles: true,
            composed: true
        }));
    }

    #emitirDiasTranscurridos() {
        if (!this.#data?.fechaVisita) return;
        const hoy = new Date();                     // se evaluará en tiempo real
        const visita = new Date(this.#data.fechaVisita);
        const diff = Math.floor((hoy - visita) / (1000 * 60 * 60 * 24));

        // Evento pidiendo actualizar el encabezado global
        this.dispatchEvent(new CustomEvent('dias-actualizados', {
            detail: { dias: diff },
            bubbles: true,
            composed: true
        }));
    }
}

// Definición del custom element
customElements.define('canary-space', CanarySpace);
