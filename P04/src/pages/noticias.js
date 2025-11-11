import React from "react";
import Layout from "../components/Layout/Layout";
import { Noticia } from "../components/Noticia/Noticia";
import { useLocation } from "@reach/router";

const NoticiasPage = () => {
    const location = useLocation();
    const { customId } = location.state || {};

    return (
        <Layout>
            <div className="flex flex-row gap-4" data-testid="noticias-container">
                <Noticia customId={customId}></Noticia>
            </div>
        </Layout>
    )
}

export default NoticiasPage
