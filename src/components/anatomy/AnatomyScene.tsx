import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei";
import { Suspense, useRef, useEffect, Component, ReactNode } from "react";
import * as THREE from "three";

const PAGES_BASE =
  "https://jovanilov93-del.github.io/digital-skeletal-studio/models";

export const MODEL_URLS: Record<string, string> = {
  skeletal:      `${PAGES_BASE}/skeletal.glb`,
  muscular:      `${PAGES_BASE}/muscular.glb`,
  nervous:       `${PAGES_BASE}/nervous.glb`,
  circulatory:   `${PAGES_BASE}/circulatory.glb`,
  respiratory:   `${PAGES_BASE}/respiratory.glb`,
  digestive:     `${PAGES_BASE}/digestive.glb`,
  urinary:       `${PAGES_BASE}/urinary.glb`,
  lymphatic:     `${PAGES_BASE}/lymphatic.glb`,
  endocrine:     `${PAGES_BASE}/endocrine.glb`,
  reproductive:  `${PAGES_BASE}/reproductive.glb`,
  integumentary: `${PAGES_BASE}/integumentary.glb`,
};

// Tell drei where the Draco decoder lives (served from /public/draco/)
useGLTF.setDecoderPath("/draco/");

// ── Error boundary so a failed model load doesn't crash the whole page ──
interface EBState { error: Error | null }
class SceneErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { error: null };
  static getDerivedStateFromError(error: Error): EBState { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <Html center>
          <div className="text-center text-muted-foreground text-xs px-4">
            <p className="font-semibold mb-1">Could not load model</p>
            <p className="opacity-70">{this.state.error.message}</p>
          </div>
        </Html>
      );
    }
    return this.props.children;
  }
}

// ── Progress overlay shown while model downloads ──
function LoadingOverlay() {
  const { progress, active } = useProgress();
  if (!active) return null;
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-48 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          Loading… {Math.round(progress)}%
        </span>
      </div>
    </Html>
  );
}

// ── The actual model mesh ──
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

  // Apply opacity whenever it changes
  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mesh = obj as THREE.Mesh;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        mat.transparent = opacity < 1;
        mat.opacity = opacity;
        mat.needsUpdate = true;
      });
    });
  }, [scene, opacity]);

  // Centre and scale the model to fit the camera
  useEffect(() => {
    if (!groupRef.current) return;
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    groupRef.current.scale.setScalar(scale);
    groupRef.current.position.copy(centre.multiplyScalar(-scale));
  }, [system]);

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        onClick={(e: { stopPropagation: () => void; object: THREE.Object3D }) => {
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

// ── Main export ──
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
    camera={{ position: [0, 0, 3.5], fov: 45 }}
    className="!bg-transparent"
    gl={{ antialias: true }}
  >
    <ambientLight intensity={0.7} />
    <directionalLight position={[5, 5, 5]} intensity={1.2} color="#88ddff" />
    <directionalLight position={[-5, 3, -3]} intensity={0.5} color="#ff99aa" />
    <pointLight position={[0, 2, 3]} intensity={0.5} color="#00d4ff" />

    <Suspense fallback={<LoadingOverlay />}>
      <SceneErrorBoundary>
        <AnatomyModel
          system={system}
          opacity={opacity}
          onSelect={onSelect}
          selected={selected}
        />
      </SceneErrorBoundary>
    </Suspense>

    <OrbitControls
      enablePan={false}
      minDistance={1}
      maxDistance={10}
      makeDefault
    />
  </Canvas>
);
