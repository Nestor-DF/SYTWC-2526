import React, { useMemo, useState } from "react";
import ModelViewer from "./ModelViewer";
import "./App.css";

export default function App() {
    const skins = useMemo(
        () => [
            { id: "arcana_aurora", name: "Arcana Aurora", url: "/models/arcana_aurora.glb" },
            { id: "immortal_journey_zaahen", name: "Immortal Journey Zaahen", url: "/models/immortal_journey_zaahen.glb" },
            { id: "soul_fighter_naafiri", name: "Soul Fighter Naafiri", url: "/models/soul_fighter_naafiri.glb" },
            { id: "spirit_blossom_akali", name: "Spirit Blossom Akali", url: "/models/spirit_blossom_akali.glb" },
        ],
        []
    );

    const [selectedId, setSelectedId] = useState(skins[0].id);
    const selected = skins.find((s) => s.id === selectedId) || skins[0];

    return (
        <div className="page">
            <header className="header">
                <div>
                    <h1 className="title">Visor 3D de skins (LoL)</h1>
                    <p className="subtitle">
                        Selecciona una skin y usa el ratón: arrastrar para rotar, rueda para zoom.
                    </p>
                </div>

                <div className="controls">
                    <label className="label" htmlFor="skin-select">Skin</label>
                    <select
                        id="skin-select"
                        className="select"
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                    >
                        {skins.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            <ModelViewer url={selected.url} />

            <section className="info">
                <div className="card">
                    <div className="cardTitle">Información</div>
                    <div className="cardBody">
                        <div><b>Skin:</b> {selected.name}</div>
                        <div><b>Modelo:</b> {selected.url}</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
