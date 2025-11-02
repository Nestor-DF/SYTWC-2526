import React, { useMemo, useState } from "react";
import { graphql, useStaticQuery } from "gatsby";
import "./EspacioCultural.scss";
import { Link } from "gatsby"

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

    const [mostrarRatings, setMostrarRatings] = useState(false);

    const espacio = useMemo(
        () =>
            data?.allEspaciosCulturalesJson?.nodes?.find(
                (n) => n.customId === customId
            ) || null,
        [data, customId]
    );

    if (!espacio) {
        return (
            <article className={`ec ${className}`.trim()}>
                <div className="ec__msg ec__msg--error">Espacio no encontrado.</div>
            </article>
        );
    }

    const childrenWithProps = React.Children.map(children, (child) =>
        React.isValidElement(child)
            ? React.cloneElement(child, {
                customId: espacio.customId,
                visible: mostrarRatings,
            })
            : child
    );

    return (
        <article className={`ec ${className}`.trim()}>
            {espacio.imagen && (
                <img
                    className="ec__img"
                    src={espacio.imagen} // dinamico -> StaticImage no va bien
                    alt={`Imagen de ${espacio.nombre}`}
                    loading="lazy"
                />
            )}
            <div className="ec__box">
                <h3 className="ec__title">{espacio.nombre}</h3>
                <p className="ec__text">Ubicación: {espacio.ubicacion}</p>
                <div className="ec__row">
                    <span className="ec__rating">⭐ {Number(espacio.valoracionMedia).toFixed(1)}</span>
                    <button
                        type="button"
                        onClick={() => setMostrarRatings((v) => !v)}
                        className="ec__btn"
                    >
                        {mostrarRatings ? "Ocultar valoraciones" : "Mostrar valoraciones"}
                    </button>
                    <Link to="/noticias" state={{ customId: espacio.customId }} className="ec__btn">
                        Noticias
                    </Link>
                </div>

                {childrenWithProps}
            </div>
        </article>
    );
}
