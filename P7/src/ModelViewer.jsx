import React, { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html, useGLTF } from "@react-three/drei";

function LoadingOverlay() {
    return (
        <Html center>
            <div
                style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: "rgba(0,0,0,0.65)",
                    color: "white",
                    fontFamily: "system-ui, sans-serif",
                    fontSize: 14,
                }}
            >
                Cargando modelo…
            </div>
        </Html>
    );
}

function SkinModel({ url }) {
    const gltf = useGLTF(url);

    return (
        <group scale={0.01} position={[0, -1, 0]}>
            <primitive object={gltf.scene} />
        </group>
    );
}

export default function ModelViewer({ url, background = "#0b0f1a" }) {
    // Recomendado para mejor calidad de color en PBR
    const dpr = Math.min(window.devicePixelRatio, 2);

    return (
        <div
            style={{
                width: "100%",
                height: "70vh",
                borderRadius: 12,
                overflow: "hidden",
                background,
                border: "1px solid rgba(255,255,255,0.08)",
            }}
        >
            <Canvas
                dpr={dpr}
                camera={{ position: [0, 1.6, 4.5], fov: 45, near: 0.1, far: 100 }}
                gl={{ antialias: true, alpha: false }}
            >
                {/* Fondo */}
                <color attach="background" args={[background]} />

                {/* Luces base (además del HDRI) */}
                <ambientLight intensity={0.35} />
                <directionalLight position={[4, 6, 3]} intensity={1.1} />

                {/* HDRI / entorno (preset evita tener que descargar texturas) */}
                <Environment files="/hdri/qwantani_night_puresky_4k.hdr" background />

                {/* Controles de cámara */}
                <OrbitControls
                    enableDamping
                    dampingFactor={0.08}
                    minDistance={2.5}
                    maxDistance={10}
                    target={[0, 1, 0]}
                />

                {/* Suelo sutil para referencia visual */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
                    <planeGeometry args={[40, 40]} />
                    <meshStandardMaterial color="#0d1220" roughness={1} metalness={0} />
                </mesh>

                <Suspense fallback={<LoadingOverlay />}>
                    <SkinModel url={url} />
                </Suspense>
            </Canvas>
        </div>
    );
}

// Pre-carga opcional: si quieres, en App.jsx puedes llamar useGLTF.preload(url)
useGLTF.preload("/models/placeholder.glb");
