import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Environment,
    Html,
    useGLTF,
    useAnimations,
} from "@react-three/drei";

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
    const group = useRef();
    const gltf = useGLTF(url);

    const { actions, names, mixer } = useAnimations(gltf.animations, group);

    useEffect(() => {
        if (!actions || !names || names.length === 0) return;

        // Reproduce la primera (o única) animación del modelo
        const firstName = names[0];
        const action = actions[firstName];
        if (!action) return;

        action.reset().fadeIn(0.15).play();

        return () => {
            // Limpieza robusta al cambiar de modelo
            mixer?.stopAllAction();
            Object.values(actions).forEach((a) => a?.stop());
        };
    }, [actions, names, mixer, url]);

    return (
        <group ref={group} scale={0.01} position={[0, -1, 0]}>
            <primitive object={gltf.scene} />
        </group>
    );
}

export default function ModelViewer({ url, background = "#0b0f1a" }) {
    const dpr = Math.min(window.devicePixelRatio, 2);

    return (
        <div
            style={{
                width: "100%",
                height: "70vh",
                borderRadius: 12,
                overflow: "hidden",
                background,
                border: "1px solid rgba(255, 255, 255, 1)",
            }}
        >
            <Canvas
                dpr={dpr}
                camera={{ position: [0, 1, 5], fov: 50, near: 0.1, far: 100 }}
                gl={{ antialias: true, alpha: false }}
            >
                <color attach="background" args={[background]} />

                <ambientLight intensity={0.4} />
                <directionalLight position={[4, 6, 3]} intensity={2.1} />

                <mesh position={[2, 1, 0]}>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshStandardMaterial metalness={0.2} roughness={0.4} />
                </mesh>

                {/* <Environment files="/hdri/qwantani_night_puresky_4k.hdr"/> */}

                <OrbitControls
                    enableDamping
                    dampingFactor={0.08}
                    minDistance={2.5}
                    maxDistance={10}
                    target={[0, 1, 0]}
                />

                <Suspense fallback={<LoadingOverlay />}>
                    {/* Fuerza remount al cambiar de URL para evitar reutilización del mixer */}
                    <SkinModel key={url} url={url} />
                </Suspense>
            </Canvas>
        </div>
    );
}

useGLTF.preload("/models/placeholder.glb");
