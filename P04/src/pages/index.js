import * as React from 'react'
import Layout from '../components/layout'
import { StaticImage } from 'gatsby-plugin-image'

const IndexPage = () => {
    return (
        <Layout>
            <h2>Inicio</h2>
            <p>Bienvenido al portal cultural.</p>
            <StaticImage
                src="../images/example.png"
                alt="Espacio cultural"
            />
        </Layout>
    )
}

export default IndexPage
