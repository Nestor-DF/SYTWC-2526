import * as React from 'react'
import Layout from '../components/layout'

const Espacio = ({ pageContext }) => {
    const { title } = pageContext
    return (
        <Layout>
            <h1>{title}</h1>
            <p>Noticias y valoraciones del {title}.</p>
        </Layout>
    )
}

export default Espacio
