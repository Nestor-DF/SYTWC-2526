import * as React from "react"
import Layout from "../components/Layout/Layout"
import { StaticImage } from "gatsby-plugin-image"
import { EspacioCultural } from "../components/EspacioCultural/EspacioCultural"
import { SpaceRatings } from "../components/SpaceRatings/SpaceRatings"

const IndexPage = () => {
    return (
        <Layout>
            <div className="flex flex-row gap-4">
                <div className="flex flex-col items-center">
                    <EspacioCultural customId="esp-1" />
                    <SpaceRatings />
                </div>
                <div className="flex flex-col items-center">
                    <EspacioCultural customId="esp-2" />
                    <SpaceRatings />
                </div>
                <div className="flex flex-col items-center">
                    <EspacioCultural customId="esp-3" />
                    <SpaceRatings />
                </div>
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
