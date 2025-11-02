import React, { useEffect, useMemo, useState } from "react";
import { graphql, useStaticQuery } from "gatsby";
import "./SpaceRatings.scss";

export function SpaceRatings({ className = "" }) {
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        function handle(e) {
            const id = e?.detail?.customId;
            if (id) setCurrentId(id);
        }
        if (typeof document !== "undefined") {
            document.addEventListener("espacio-valoraciones", handle);
            return () => document.removeEventListener("espacio-valoraciones", handle);
        }
    }, []);

    const data = useStaticQuery(graphql`
    query RatingsQuery {
      allRatingsJson {
        nodes {
          customId
          puntuacion
          usuario
          comentario
        }
      }
    }
  `);

    const list = useMemo(
        () => (currentId ? data?.allRatingsJson?.nodes?.filter(n => n.customId === currentId) ?? [] : []),
        [data, currentId]
    );

    return (
        <section className={`sr ${className}`.trim()} aria-live="polite">
            <h4 className="sr__title">Valoraciones</h4>
            {!currentId && <div className="sr__muted">Pulsa “Mostrar valoraciones” en una tarjeta…</div>}
            {currentId && list.length === 0 && <div className="sr__muted">Este espacio aún no tiene valoraciones simuladas.</div>}
            {currentId && list.length > 0 && (
                <div className="sr__list">
                    {list.map((v, idx) => (
                        <div key={`${currentId}-${idx}`} className="sr__item">
                            <div><span className="sr__score">⭐ {v.puntuacion}</span> — {v.usuario}</div>
                            <div>{v.comentario}</div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
