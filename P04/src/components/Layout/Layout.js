import * as React from "react"
import { Link } from "gatsby"
import "./Layout.scss"

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <header>
                <h1>Espacios culturales de Canarias</h1>
            </header>

            <nav>
                <Link to="/">Inicio</Link>
                <Link to="/museo">Museo</Link>
                <Link to="/teatro">Teatro</Link>
                <Link to="/galeria">Galería</Link>
                <Link to="/contacto">Contacto</Link>
            </nav>

            <section className="content">
                <aside className="content__menu" aria-label="Menú lateral">
                    <div>Menú lateral</div>
                </aside>

                <div className="grid-espacios">
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
