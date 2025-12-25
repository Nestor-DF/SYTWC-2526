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
                    background: "rgb(23,23,23)",
                    color: "white",
                    fontFamily: "system-ui, sans-serif",
                    fontSize: 14,
                }}
            >
                Loading skin...
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

        const firstName = names[0];
        const action = actions[firstName];
        if (!action) return;

        action.reset().fadeIn(0.2).play();

        return () => {
            mixer?.stopAllAction();
            Object.values(actions).forEach((a) => a?.stop());
        };
    }, [actions, names, mixer, url]);

    return (
        <group ref={group} scale={0.01} position={[0, 0, 0]}>
            <primitive object={gltf.scene} />
        </group>
    );
}

export default function ModelViewer({ url, background = "rgb(23,23,23)" }) {
    const dpr = Math.min(window.devicePixelRatio, 2);

    return (
        <div
            style={{
                width: "100%",
                height: "70vh",
                borderRadius: 12,
                overflow: "hidden",
                background,
                border: "1px solid rgb(255, 255, 255)",
            }}
        >
            <Canvas
                dpr={dpr}
                camera={{ position: [0, 1, 5], fov: 50, near: 0.1, far: 100 }}
                gl={{ antialias: true, alpha: false }}
            >
                <color attach="background" args={[background]} />

                {/* <ambientLight intensity={0.1} /> */}
                <directionalLight position={[4, 6, 3]} intensity={0.3} />
                <Environment files="/hdri/qwantani_night_puresky_4k.hdr" />

                <OrbitControls
                    enableDamping
                    dampingFactor={0.1}
                    minDistance={1.5}
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

useGLTF.preload("/models/arcana_aurora.glb");
