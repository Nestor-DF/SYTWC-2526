import React, { useMemo } from "react";
import { graphql, useStaticQuery } from "gatsby";
import "./EspacioCultural.scss";

export function EspacioCultural({ customId, className = "", children }) {
    const data = useStaticQuery(graphql`
    query EspaciosQuery {
      allEspaciosCulturalesJson {
        nodes {
          customId
          nombre
          ubicacion
          fechaVisita
          imagen
          valoracionMedia
        }
      }
    }
  `);

    const espacio = useMemo(
        () => data?.allEspaciosCulturalesJson?.nodes?.find(n => n.customId === customId) || null,
        [data, customId]
    );

    const emitirPeticionValoraciones = () => {
        if (typeof document !== "undefined" && espacio?.customId) {
            document.dispatchEvent(new CustomEvent("espacio-valoraciones", {
                detail: { customId: espacio.customId },
                bubbles: true,
                composed: true
            }));
        }
    };

    if (!espacio) {
        return <article className={`ec ${className}`.trim()}><div className="ec__msg ec__msg--error">Espacio no encontrado.</div></article>;
    }

    return (
        <article className={`ec ${className}`.trim()}>
            {espacio.imagen && <img className="ec__img" src={espacio.imagen} alt={`Imagen de ${espacio.nombre}`} loading="lazy" />}
            <div className="ec__box">
                <h3 className="ec__title">{espacio.nombre}</h3>
                <p className="ec__text">Ubicación: {espacio.ubicacion}</p>
                <p className="ec__text ec__text--muted">Fecha de visita: {espacio.fechaVisita}</p>
                <div className="ec__row">
                    <span className="ec__rating">⭐ {Number(espacio.valoracionMedia).toFixed(1)}</span>
                    <button type="button" onClick={emitirPeticionValoraciones} className="ec__btn">
                        Mostrar valoraciones
                    </button>
                </div>
                {children}
            </div>
        </article>
    );
}
