"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 60% reduction in node density: 20 nodes total (previously 49 nodes)
const COLS = 5;
const ROWS = 4;
const SPACING = 1.6;

function LatticeNodes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lineGeoRef = useRef<THREE.BufferGeometry>(null);

  const count = COLS * ROWS;

  // Pre-calculate base positions
  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    const halfX = (COLS - 1) / 2;
    const halfZ = (ROWS - 1) / 2;

    for (let x = 0; x < COLS; x++) {
      for (let z = 0; z < ROWS; z++) {
        const px = (x - halfX) * SPACING;
        const py = 0;
        const pz = (z - halfZ) * SPACING;
        pos.push([px, py, pz]);
      }
    }
    return pos;
  }, []);

  // Pre-calculate connection lines
  const linePositions = useMemo(() => {
    const points: number[] = [];
    const halfX = (COLS - 1) / 2;
    const halfZ = (ROWS - 1) / 2;

    for (let x = 0; x < COLS; x++) {
      for (let z = 0; z < ROWS; z++) {
        const px = (x - halfX) * SPACING;
        const pz = (z - halfZ) * SPACING;

        if (x < COLS - 1) {
          const nextPx = (x + 1 - halfX) * SPACING;
          points.push(px, 0, pz, nextPx, 0, pz);
        }
        if (z < ROWS - 1) {
          const nextPz = (z + 1 - halfZ) * SPACING;
          points.push(px, 0, pz, px, 0, nextPz);
        }
      }
    }
    return new Float32Array(points);
  }, []);

  // Pre-allocated object to avoid garbage collection inside render loop
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const [bx, by, bz] = positions[i];
      // Gentle sine wave float
      const floatY = by + Math.sin(time * 1.2 + i * 0.45) * 0.12;

      dummy.position.set(bx, floatY, bz);
      dummy.scale.set(0.18, 0.18, 0.18);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group rotation={[-Math.PI / 4.8, 0, Math.PI / 6]} position={[0, -0.2, 0]}>
      {/* Connecting lattice grid lines */}
      <lineSegments>
        <bufferGeometry ref={lineGeoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Floating instanced dark glass nodes */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        castShadow={false}
        receiveShadow={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          roughness={0.2}
          metalness={0.8}
          color="#12141c"
          emissive="#00F0FF"
          emissiveIntensity={0.4}
        />
      </instancedMesh>
    </group>
  );
}

export default function NeuralLatticeCanvas() {
  return (
    <div
      className="absolute inset-0 h-full w-full pointer-events-none select-none"
      style={{ pointerEvents: "none" }}
    >
      <Canvas
        camera={{ position: [0, 4, 6], fov: 42 }}
        dpr={[1, 1.5]}
        shadows={false}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          depth: true,
          stencil: false,
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.0} color="#ffffff" castShadow={false} />
        <pointLight position={[0, 2, 2]} intensity={2.0} color="#00F0FF" distance={8} castShadow={false} />
        <LatticeNodes />
      </Canvas>
    </div>
  );
}
