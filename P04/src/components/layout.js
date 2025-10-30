import * as React from 'react'
import { Link } from 'gatsby'
import './layout.css'

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <header>
                <h1>Sitio de Noticias Culturales</h1>
                <nav>
                    <Link to="/">Inicio</Link> |
                    <Link to="/museo">Museo</Link> |
                    <Link to="/teatro">Teatro</Link> |
                    <Link to="/galeria">Galería</Link>
                </nav>
            </header>
            <main>{children}</main>
            <footer>© 2025 - Proyecto Gatsby</footer>
        </div>
    )
}

export default Layout
