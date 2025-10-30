import React, { useMemo } from "react";
import { graphql, useStaticQuery } from "gatsby";
import "./EspacioCultural.scss";

export function EspacioCultural({ espacioId, className = "", children }) {
    const data = useStaticQuery(graphql`
    query EspaciosQuery {
      allEspaciosCulturalesJson {
        nodes {
          id
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
        () => data?.allEspaciosCulturalesJson?.nodes?.find(n => n.nombre === espacioId) || null,
        [data, espacioId]
    );

    console.log(data?.allEspaciosCulturalesJson?.nodes);

    const emitirPeticionValoraciones = () => {
        if (typeof document !== "undefined" && espacio?.id) {
            document.dispatchEvent(new CustomEvent("espacio-valoraciones", {
                detail: { espacioId: espacio.id },
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
