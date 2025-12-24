import React, { useMemo, useState } from "react";
import ModelViewer from "./ModelViewer";
import "./App.css";

export default function App() {
    const skins = useMemo(
        () => [
            {
                id: "arcana_aurora",
                name: "Arcana Aurora",
                url: "/models/arcana_aurora.glb",
                description:
                    "Those below know Aurora as an eccentric academic at the Grand Library, wandering off to study the mysterious workings of the fabled Pattern. Those above know Aurora as the Witch Betwixt, one of the few Higher Arcana able to find portals hidden within the magic of all things, and travel the cities across their mirroring axis. As above, so below.",
            },
            {
                id: "immortal_journey_zaahen",
                name: "Immortal Journey Zaahen",
                url: "/models/immortal_journey_zaahen.glb",
                description:
                    "Wielding a divine glaive and sacred waters, the dragon king Zaahen ruled the eastern seas. But prophecy foretold that rage would drown his mercy, bringing deathly floods. Zaahen withdrew to the depths of his court… until a scholar dared to descend, seeking the truth of the god beneath the waves. Stirred, Zaahen now fights the ruin he was fated to unleash.",
            },
            {
                id: "soul_fighter_naafiri",
                name: "Soul Fighter Naafiri",
                url: "/models/soul_fighter_naafiri.glb",
                description:
                    "Failed experiment! DEMA DOG! The Four-legged Fighter! This... creature... has almost as many titles as it does separate entities it can summon! Does it want revenge on its former masters? To take over the world? I don't know! I'm no dog mind reader! It's.... Naafiri!",
            },
            {
                id: "spirit_blossom_akali",
                name: "Spirit Blossom Akali",
                url: "/models/spirit_blossom_akali.glb",
                description:
                    "A young warrior's master warned her of the world's cruelty and the dispassion it required, then told her to cut out her heart. But when she raised the blade, she could not do it. She would face the world, heart intact. She ran, seeking a new path, and found the Burning Shade—a master who did not demand her heart, but destroyed it all the same.",
            },
        ],
        []
    );

    const [selectedId, setSelectedId] = useState(skins[0].id);
    const selected = skins.find((s) => s.id === selectedId) || skins[0];

    return (
        <div className="page">
            <header className="header">
                <div>
                    <h1 className="title">League of Legends Skin Viewer</h1>
                    <p className="subtitle">
                        Select a skin and use the mouse: drag to rotate (hold Ctrl to move the skin), and use the scroll wheel to zoom.
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
                    <div className="cardTitle">Info</div>
                    <div className="cardBody">
                        <div><b>Skin:</b> {selected.name}</div>
                        <div><b>Description:</b> {selected.description}</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
