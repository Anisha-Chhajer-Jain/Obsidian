"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, Environment } from "@react-three/drei";
import * as THREE from "three";

function RotatingLogo({ color }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 1.5;
      meshRef.current.rotation.x += delta * 0.6;
    }
  });

  return (
    <Icosahedron ref={meshRef} args={[1, 1]} scale={1.2}>
      <meshStandardMaterial
        color={color || "#60A5FA"}
        flatShading={true}
        roughness={0.3}
        metalness={0.7}
      />
    </Icosahedron>
  );
}

interface ThreeDLogoProps {
  className?: string;
  color?: string;
}

export default function ThreeDLogo({ className = "w-8 h-8", color }: ThreeDLogoProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <RotatingLogo color={color} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
