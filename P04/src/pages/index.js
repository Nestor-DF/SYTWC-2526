import * as React from "react"
import Layout from "../components/Layout/Layout"
import { StaticImage } from "gatsby-plugin-image"
import { EspacioCultural } from "../components/EspacioCultural/EspacioCultural"
import { SpaceRatings } from "../components/SpaceRatings/SpaceRatings"

const IndexPage = () => {
    return (
        <Layout>
            <div className="p-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <EspacioCultural espacioId="TEA Tenerife Espacio de las Artes"></EspacioCultural>
                </div>
                <SpaceRatings />
            </div>
        </Layout>
    )
}

export const Head = () => (
    <>
        <title>Espacios culturales de Canarias — Micro-frontends</title>
        <meta
            name="description"
            content="Portal de espacios culturales de Canarias: museos, teatros y galerías."
        />
    </>
)

export default IndexPage
