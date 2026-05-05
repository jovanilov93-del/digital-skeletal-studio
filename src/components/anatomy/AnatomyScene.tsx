import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useProgress, Environment } from "@react-three/drei";
import { Suspense, useRef, useEffect } from "react";
import * as THREE from "three";

const RELEASE_BASE =
  "https://github.com/jovanilov93-del/digital-skeletal-studio/releases/download/v1.0-models";

const MODEL_URLS: Record<string, string> = {
  skeletal:      `${RELEASE_BASE}/skeletal.glb`,
  muscular:      `${RELEASE_BASE}/muscular.glb`,
  nervous:       `${RELEASE_BASE}/nervous.glb`,
  circulatory:   `${RELEASE_BASE}/circulatory.glb`,
  respiratory:   `${RELEASE_BASE}/respiratory.glb`,
  digestive:     `${RELEASE_BASE}/digestive.glb`,
  urinary:       `${RELEASE_BASE}/urinary.glb`,
  lymphatic:     `${RELEASE_BASE}/lymphatic.glb`,
  endocrine:     `${RELEASE_BASE}/endocrine.glb`,
  reproductive:  `${RELEASE_BASE}/reproductive.glb`,
  integumentary: `${RELEASE_BASE}/integumentary.glb`,
};

function LoadingOverlay() {
  const { progress, active } = useProgress();
  if (!active) return null;
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 text-foreground">
        <div className="w-48 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          Loading model… {Math.round(progress)}%
        </span>
      </div>
    </Html>
  );
}

function AnatomyModel({
  system,
  opacity,
  onSelect,
  selected,
}: {
  system: string;
  opacity: number;
  onSelect: (name: string) => void;
  selected: string | null;
}) {
  const url = MODEL_URLS[system] ?? MODEL_URLS.skeletal;
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!scene) return;
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const mat = mesh.material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => { (m as THREE.MeshStandardMaterial).transparent = true; (m as THREE.MeshStandardMaterial).opacity = opacity; });
        } else {
          (mat as THREE.MeshStandardMaterial).transparent = true;
          (mat as THREE.MeshStandardMaterial).opacity = opacity;
        }
      }
    });
  }, [scene, opacity]);

  // Centre the model
  useEffect(() => {
    if (!groupRef.current) return;
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const centre = box.getCenter(new THREE.Vector3());
    groupRef.current.position.sub(centre);
  }, [system]);

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        onClick={(e: THREE.Event & { object: THREE.Object3D; stopPropagation: () => void }) => {
          e.stopPropagation();
          onSelect(e.object.name || system);
        }}
      />
      {selected && (
        <Html distanceFactor={8} position={[0, 1.2, 0]} center>
          <div className="px-2 py-1 rounded-md bg-card border border-border text-xs whitespace-nowrap shadow-elegant pointer-events-none">
            {selected}
          </div>
        </Html>
      )}
    </group>
  );
}

// Preload next likely model in the background
function Preloader({ system }: { system: string }) {
  const systems = Object.keys(MODEL_URLS);
  const idx = systems.indexOf(system);
  const next = systems[(idx + 1) % systems.length];
  useGLTF.preload(MODEL_URLS[next]);
  return null;
}

export const AnatomyScene = ({
  system,
  onSelect,
  selected,
  opacity = 1,
}: {
  system: string;
  onSelect: (id: string) => void;
  selected: string | null;
  opacity?: number;
}) => (
  <Canvas
    camera={{ position: [0, 0, 3], fov: 45 }}
    className="!bg-transparent"
    gl={{ antialias: true }}
  >
    <ambientLight intensity={0.6} />
    <directionalLight position={[5, 5, 5]} intensity={1.2} color="#88ddff" castShadow />
    <directionalLight position={[-5, 3, -3]} intensity={0.5} color="#ff99aa" />
    <pointLight position={[0, 2, 3]} intensity={0.6} color="#00d4ff" />
    <Environment preset="city" />

    <Suspense fallback={<LoadingOverlay />}>
      <AnatomyModel
        system={system}
        opacity={opacity}
        onSelect={onSelect}
        selected={selected}
      />
      <Preloader system={system} />
    </Suspense>

    <OrbitControls
      enablePan={false}
      minDistance={1}
      maxDistance={10}
      autoRotate={false}
      makeDefault
    />
  </Canvas>
);
