import React, { useEffect, useState } from "react";
import "./SpaceRatings.scss";


export function SpaceRatings({ className = "" }) {
    const [state, setState] = useState({ kind: "idle" });
    const [items, setItems] = useState([]);


    useEffect(() => {
        function handle(e) {
            const espacioId = e?.detail?.espacioId;
            if (!espacioId) return;
            void cargarValoraciones(espacioId);
        }
        if (typeof document !== "undefined") document.addEventListener("espacio-valoraciones", handle);
        return () => { if (typeof document !== "undefined") document.removeEventListener("espacio-valoraciones", handle); };
    }, []);


    async function cargarValoraciones(id) {
        setState({ kind: "loading" });
        try {
            const res = await fetch("/data/ratings.json", { credentials: "same-origin" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const all = await res.json();
            const list = (all && all[id]) || [];
            setItems(Array.isArray(list) ? list : []);
            setState({ kind: "ready" });
        } catch (err) {
            console.error(err);
            setState({ kind: "error" });
        }
    }


    return (
        <section className={`sr ${className}`.trim()} aria-live="polite">
            <h4 className="sr__title">Valoraciones</h4>
            {state.kind === "idle" && <div className="sr__muted">Pulsa “Mostrar valoraciones” en una tarjeta…</div>}
            {state.kind === "loading" && <div className="sr__muted">Cargando valoraciones…</div>}
            {state.kind === "error" && <div className="sr__error">Error cargando valoraciones.</div>}
            {state.kind === "ready" && items.length === 0 && (
                <div className="sr__muted">Este espacio aún no tiene valoraciones simuladas.</div>
            )}
            {state.kind === "ready" && items.length > 0 && (
                <div className="sr__list">
                    {items.map((v, idx) => (
                        <div key={idx} className="sr__item">
                            <div>
                                <span className="sr__score">⭐ {v.puntuacion}</span> — {v.usuario}
                            </div>
                            <div>{v.comentario}</div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}