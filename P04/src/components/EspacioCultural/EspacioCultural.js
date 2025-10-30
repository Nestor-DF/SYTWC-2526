import React, { useEffect, useMemo, useRef, useState } from "react";
import "./EspacioCultural.scss";


export function EspacioCultural({ espacioId, mostrarValoraciones = false, className = "", children }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const hasAutoFiredRef = useRef(false);


    useEffect(() => {
        let isMounted = true;
        async function load() {
            if (!espacioId) return;
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("/data/espacios-culturales.json", { credentials: "same-origin" });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const spaces = await res.json();
                const found = Array.isArray(spaces) ? spaces.find((e) => e.id === espacioId) : null;
                if (!found) throw new Error("Espacio no encontrado");
                if (isMounted) setData(found);
            } catch (err) {
                console.error("Error cargando espacio:", err);
                if (isMounted) setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        load();
        return () => { isMounted = false; };
    }, [espacioId]);


    const emitirPeticionValoraciones = () => {
        if (!data?.id || typeof document === "undefined") return;
        const ev = new CustomEvent("espacio-valoraciones", {
            detail: { espacioId: data.id },
            bubbles: true,
            composed: true,
        });
        document.dispatchEvent(ev);
    };


    useEffect(() => {
        if (mostrarValoraciones && data && !hasAutoFiredRef.current) {
            hasAutoFiredRef.current = true;
            emitirPeticionValoraciones();
        }
    }, [mostrarValoraciones, data]);


    const content = useMemo(() => {
        if (loading) return <div className="ec__msg">Cargando espacio…</div>;
        if (error) return <div className="ec__msg ec__msg--error">No se pudo cargar el espacio.</div>;
        if (!data) return null;


        return (
            <>
                {data.imagen && (
                    <img className="ec__img" src={data.imagen} alt={`Imagen de ${data.nombre}`} loading="lazy" />
                )}
                <div className="ec__box">
                    <h3 className="ec__title">{data.nombre}</h3>
                    <p className="ec__text">Ubicación: {data.ubicacion}</p>
                    <p className="ec__text ec__text--muted">Fecha de visita: {data.fechaVisita}</p>
                    <div className="ec__row">
                        <span className="ec__rating">⭐ {Number(data.valoracionMedia).toFixed(1)}</span>
                        <button type="button" onClick={emitirPeticionValoraciones} className="ec__btn">
                            Mostrar valoraciones
                        </button>
                    </div>
                    {children}
                </div>
            </>
        );
    }, [data, loading, error]);
}