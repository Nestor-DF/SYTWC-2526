import React, { useMemo } from "react";
import { graphql, useStaticQuery } from "gatsby";
import "./SpaceRatings.scss";

export function SpaceRatings({ customId, visible = false, className = "" }) {
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

    const list = useMemo(() => {
        if (!customId) return [];
        return data?.allRatingsJson?.nodes?.filter((n) => n.customId === customId) ?? [];
    }, [data, customId]);

    return (
        <section className={`sr ${className}`.trim()} aria-live="polite">
            <h4 className="sr__title">Valoraciones</h4>
            {!visible && <div className="sr__muted">Pulsa “Mostrar valoraciones” en esta tarjeta…</div>}
            {visible && list.length === 0 && (
                <div className="sr__muted">Este espacio aún no tiene valoraciones simuladas.</div>
            )}
            {visible && list.length > 0 && (
                <div className="sr__list">
                    {list.map((v, idx) => (
                        <div key={`${customId}-${idx}`} className="sr__item">
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
