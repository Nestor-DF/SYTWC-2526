import * as React from "react"
import Layout from "../components/Layout/Layout"
import { EspacioCultural } from "../components/EspacioCultural/EspacioCultural"
import { SpaceRatings } from "../components/SpaceRatings/SpaceRatings"

const IndexPage = () => {
    return (
        <Layout>
            <div className="flex flex-row gap-4">
                <div className="flex flex-col items-center">
                    <EspacioCultural customId="esp-1">
                        <SpaceRatings />
                    </EspacioCultural>
                </div>
                <div className="flex flex-col items-center">
                    <EspacioCultural customId="esp-2">
                        <SpaceRatings />
                    </EspacioCultural>
                </div>
                <div className="flex flex-col items-center">
                    <EspacioCultural customId="esp-3">
                        <SpaceRatings />
                    </EspacioCultural>
                </div>
            </div>
        </Layout>
    )
}

export default IndexPage
