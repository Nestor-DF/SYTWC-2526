import * as React from "react"
import { Link } from "gatsby"
import "./Layout.scss"
import { StaticImage } from "gatsby-plugin-image";

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <header>
                <h1>Espacios culturales de Canarias</h1>
            </header>

            <nav>
                <Link to="/">Inicio</Link>
                <Link to="/mas-info">Más información</Link>
                <Link to="/preguntas-frecuentes">Preguntas frecuentes</Link>
                <Link to="/contacto">Contacto</Link>
            </nav>

            <section className="content">
                <aside className="content__menu" aria-label="Menú lateral">
                    <div>Menú lateral</div>
                    <StaticImage
                        src="../../images/flag.png"
                        alt="Vista del espacio cultural"
                        placeholder="blurred"
                        layout="constrained"
                        width={300}
                    />
                </aside>

                <div>
                    {children}
                </div>
            </section>

            <footer>
                <p>
                    © 2025 Espacios Culturales de Canarias —{" "}
                    <Link to="/aviso-legal">Aviso legal</Link>
                </p>
            </footer>
        </div>
    )
}

export default Layout
