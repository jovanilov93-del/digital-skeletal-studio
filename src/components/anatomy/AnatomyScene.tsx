import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Html } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";

const HOTSPOTS = [
  { id: "brain", label: "Brain", pos: [0, 1.55, 0.1] as [number, number, number] },
  { id: "heart", label: "Heart", pos: [-0.18, 0.55, 0.25] as [number, number, number] },
  { id: "lungs", label: "Lungs", pos: [0.35, 0.6, 0.15] as [number, number, number] },
  { id: "liver", label: "Liver", pos: [0.25, 0.15, 0.2] as [number, number, number] },
  { id: "femur", label: "Femur", pos: [0.18, -1.0, 0] as [number, number, number] },
];

function HumanFigure({ system, onSelect, selected }: { system: string; onSelect: (id: string) => void; selected: string | null }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (group.current) group.current.rotation.y += dt * 0.15; });

  const skinColor = system === "skeletal" ? "#e8e2d5" : system === "muscular" ? "#a83232" : system === "nervous" ? "#f0d878" : "#d89a85";
  const opacity = system === "skeletal" ? 0.25 : 0.85;

  return (
    <group ref={group}>
      {/* Head */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color={skinColor} transparent opacity={opacity} roughness={0.6} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.18, 0]}>
        <cylinderGeometry args={[0.1, 0.13, 0.18, 16]} />
        <meshStandardMaterial color={skinColor} transparent opacity={opacity} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.55, 0]}>
        <capsuleGeometry args={[0.42, 0.7, 8, 16]} />
        <meshStandardMaterial color={skinColor} transparent opacity={opacity} roughness={0.5} />
      </mesh>
      {/* Arms */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.55 * s, 0.55, 0]} rotation={[0, 0, 0.2 * s]}>
          <capsuleGeometry args={[0.11, 0.85, 6, 12]} />
          <meshStandardMaterial color={skinColor} transparent opacity={opacity} />
        </mesh>
      ))}
      {/* Hips */}
      <mesh position={[0, -0.05, 0]}>
        <capsuleGeometry args={[0.34, 0.2, 8, 16]} />
        <meshStandardMaterial color={skinColor} transparent opacity={opacity} />
      </mesh>
      {/* Legs */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.18 * s, -0.85, 0]}>
          <capsuleGeometry args={[0.14, 1.0, 8, 16]} />
          <meshStandardMaterial color={skinColor} transparent opacity={opacity} />
        </mesh>
      ))}

      {/* Skeletal accents when in skeletal mode */}
      {system === "skeletal" && (
        <>
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[0.55, 0.7, 0.32]} />
            <meshStandardMaterial color="#f5f1e6" />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.5, 0.18, 0.3]} />
            <meshStandardMaterial color="#f5f1e6" />
          </mesh>
        </>
      )}

      {/* Hotspots */}
      {HOTSPOTS.map((h) => (
        <Float key={h.id} speed={2} rotationIntensity={0} floatIntensity={0.3}>
          <mesh position={h.pos} onClick={(e) => { e.stopPropagation(); onSelect(h.id); }}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial
              color={selected === h.id ? "#ff3388" : "#00d4ff"}
              emissive={selected === h.id ? "#ff3388" : "#00d4ff"}
              emissiveIntensity={1.5}
            />
          </mesh>
          {selected === h.id && (
            <Html position={h.pos} distanceFactor={6} center>
              <div className="px-2 py-1 rounded-md bg-card border border-border text-xs whitespace-nowrap shadow-elegant">
                {h.label}
              </div>
            </Html>
          )}
        </Float>
      ))}
    </group>
  );
}

export const AnatomyScene = ({ system, onSelect, selected }: { system: string; onSelect: (id: string) => void; selected: string | null }) => (
  <Canvas camera={{ position: [0, 0.3, 4.5], fov: 45 }} className="!bg-transparent">
    <ambientLight intensity={0.5} />
    <directionalLight position={[5, 5, 5]} intensity={1.2} color="#88ddff" />
    <directionalLight position={[-5, 3, -3]} intensity={0.6} color="#ff77aa" />
    <pointLight position={[0, 2, 3]} intensity={0.8} color="#00d4ff" />
    <Suspense fallback={null}>
      <HumanFigure system={system} onSelect={onSelect} selected={selected} />
    </Suspense>
    <OrbitControls enablePan={false} minDistance={3} maxDistance={8} autoRotate={false} />
  </Canvas>
);
