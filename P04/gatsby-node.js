/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

exports.createPages = async ({ actions, graphql }) => {
    const { createPage } = actions

    const espacios = [
        { name: 'museo', title: 'Museo' },
        { name: 'teatro', title: 'Teatro' },
        { name: 'galeria', title: 'Galería' },
    ]

    espacios.forEach(espacio => {
        createPage({
            path: `/${espacio.name}`,
            component: require.resolve(`./src/templates/espacio.js`),
            context: { title: espacio.title },
        })
    })
}

