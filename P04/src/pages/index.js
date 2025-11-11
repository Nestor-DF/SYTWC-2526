import * as React from "react"
import Layout from "../components/Layout/Layout"
import { EspacioCultural } from "../components/EspacioCultural/EspacioCultural"
import { SpaceRatings } from "../components/SpaceRatings/SpaceRatings"

const IndexPage = () => {
    return (
        <Layout>
            {/* Identificador de página */}
            <main data-testid="home-page">

                {/* Contenedor de todos los espacios */}
                <div data-testid="espacios-container" className="flex flex-row gap-4">

                    {/* Espacio 1 */}
                    <div data-testid="espacio-wrapper-1" className="flex flex-col items-center">
                        <EspacioCultural data-testid="espacio-1" customId="esp-1">
                            <SpaceRatings data-testid="ratings-1" />
                        </EspacioCultural>
                    </div>

                    {/* Espacio 2 */}
                    <div data-testid="espacio-wrapper-2" className="flex flex-col items-center">
                        <EspacioCultural data-testid="espacio-2" customId="esp-2">
                            <SpaceRatings data-testid="ratings-2" />
                        </EspacioCultural>
                    </div>

                    {/* Espacio 3 */}
                    <div data-testid="espacio-wrapper-3" className="flex flex-col items-center">
                        <EspacioCultural data-testid="espacio-3" customId="esp-3">
                            <SpaceRatings data-testid="ratings-3" />
                        </EspacioCultural>
                    </div>

                </div>

            </main>
        </Layout>
    )
}

export default IndexPage
