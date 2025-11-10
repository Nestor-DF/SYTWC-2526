import React, { useMemo, useState } from "react";
import { graphql, useStaticQuery } from "gatsby";
import "./Noticia.scss";

export function Noticia({ customId, className = "", children }) {
    const data = useStaticQuery(graphql`
    query NoticiasDeEspacioQuery {
      allNoticiasJson {
        nodes {
          customId
          titulo
          contenido
          autor
          fecha
        }
      }
    }
  `);

    const [expandidaMap, setExpandidaMap] = useState({});

    const noticias = useMemo(() => {
        const nodes = data?.allNoticiasJson?.nodes || [];
        return nodes
            .filter((n) => n.customId === customId)
            .sort((a, b) => {
                const da = new Date(a.fecha || 0).getTime();
                const db = new Date(b.fecha || 0).getTime();
                return db - da;
            });
    }, [data, customId]);

    const toggleExpand = (key) =>
        setExpandidaMap((prev) => ({ ...prev, [key]: !prev[key] }));

    if (!noticias.length) {
        return (
            <article className={`ntc-list ${className}`.trim()}>
                <div className="ntc__msg ntc__msg--error">
                    No hay noticias para este espacio.
                </div>
            </article>
        );
    }

    return (
        <section className={`ntc-list ${className}`.trim()}>
            {noticias.map((n, idx) => {
                const key = `${n.customId}-${n.fecha || "sinf"}-${idx}`;
                const expandida = !!expandidaMap[key];

                const fechaFormateada = (() => {
                    if (!n.fecha) return "";
                    const d = new Date(n.fecha);
                    if (isNaN(d.getTime())) return n.fecha;
                    return d.toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                    });
                })();

                const previewLen = 150;
                const contenido = n.contenido || "";
                const isLarga = contenido.length > previewLen;
                const textoVisible =
                    expandida || !isLarga ? contenido : `${contenido.slice(0, previewLen)}…`;

                const childrenWithProps = React.Children.map(children, (child) =>
                    React.isValidElement(child)
                        ? React.cloneElement(child, {
                            customId: n.customId,
                            visible: expandida,
                        })
                        : child
                );

                return (
                    <article className="ntc" key={key}>
                        <div className="ntc__box">
                            <h3 className="ntc__title">{n.titulo}</h3>

                            <p className="ntc__meta">
                                <span className="ntc__autor">Por {n.autor}</span>
                                <span className="ntc__dot">•</span>
                                <time dateTime={n.fecha} className="ntc__fecha">
                                    {fechaFormateada}
                                </time>
                            </p>

                            <p className={`ntc__text ${expandida ? "" : "ntc__text--clamp"}`}>
                                {textoVisible}
                            </p>

                            <div className="ntc__row">
                                {isLarga && (
                                    <button
                                        type="button"
                                        onClick={() => toggleExpand(key)}
                                        className="ntc__btn"
                                        aria-expanded={expandida}
                                    >
                                        {expandida ? "Leer menos" : "Leer más"}
                                    </button>
                                )}
                            </div>

                            {childrenWithProps}
                        </div>
                    </article>
                );
            })}
        </section>
    );
}
