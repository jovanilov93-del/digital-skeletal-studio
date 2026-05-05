import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei";
import {
  Suspense,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  Component,
  ReactNode,
} from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

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

// Consistent starting camera for every model
const CAM_POSITION = new THREE.Vector3(0, 0.5, 3.5);
const CAM_TARGET   = new THREE.Vector3(0, 0, 0);

useGLTF.setDecoderPath("/draco/");

// ─── Handle exposed to parent ───────────────────────────────────────────────
export interface AnatomySceneHandle {
  resetCamera: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

// ─── Error boundary ──────────────────────────────────────────────────────────
interface EBState { error: Error | null }
class SceneErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { error: null };
  static getDerivedStateFromError(e: Error): EBState { return { error: e }; }
  render() {
    if (this.state.error)
      return (
        <Html center>
          <div className="text-center text-muted-foreground text-xs px-4 max-w-[200px]">
            <p className="font-semibold mb-1 text-destructive">Could not load model</p>
            <p className="opacity-70">{this.state.error.message}</p>
          </div>
        </Html>
      );
    return this.props.children;
  }
}

// ─── Download progress bar ───────────────────────────────────────────────────
function LoadingOverlay() {
  const { progress, active } = useProgress();
  if (!active) return null;
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 min-w-[180px]">
        <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-200"
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

// ─── Controls wired to parent handle ────────────────────────────────────────
function SceneControls({
  controlsRef,
}: {
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();

  // Set starting position once
  useEffect(() => {
    camera.position.copy(CAM_POSITION);
    camera.lookAt(CAM_TARGET);
  }, [camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      enableZoom
      enableRotate
      minDistance={1}
      maxDistance={12}
      target={CAM_TARGET}
      makeDefault
    />
  );
}

// ─── The model mesh ──────────────────────────────────────────────────────────
function AnatomyModel({
  system,
  opacity,
  onSelect,
  selected,
  showLabels,
}: {
  system: string;
  opacity: number;
  onSelect: (name: string) => void;
  selected: string | null;
  showLabels: boolean;
}) {
  const url = MODEL_URLS[system] ?? MODEL_URLS.skeletal;
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  // Opacity
  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mats = Array.isArray((obj as THREE.Mesh).material)
        ? ((obj as THREE.Mesh).material as THREE.Material[])
        : [(obj as THREE.Mesh).material as THREE.Material];
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        mat.transparent = opacity < 1;
        mat.opacity = opacity;
        mat.needsUpdate = true;
      });
    });
  }, [scene, opacity]);

  // Centre + scale every model the same way
  useEffect(() => {
    if (!groupRef.current) return;
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.2 / maxDim;
    groupRef.current.scale.setScalar(scale);
    groupRef.current.position.copy(centre.multiplyScalar(-scale));
  }, [system, scene]);

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        onClick={(e: { stopPropagation: () => void; object: THREE.Object3D }) => {
          e.stopPropagation();
          if (e.object.name) onSelect(e.object.name);
        }}
      />
      {showLabels && selected && (
        <Html distanceFactor={8} position={[0, 1.4, 0]} center>
          <div className="px-2 py-1 rounded-md bg-card border border-primary/40 text-xs whitespace-nowrap shadow-elegant pointer-events-none text-foreground">
            {selected}
          </div>
        </Html>
      )}
    </group>
  );
}

// ─── Exported scene ──────────────────────────────────────────────────────────
export const AnatomyScene = forwardRef<
  AnatomySceneHandle,
  {
    system: string;
    onSelect: (id: string) => void;
    selected: string | null;
    opacity?: number;
    showLabels?: boolean;
  }
>(({ system, onSelect, selected, opacity = 1, showLabels = true }, ref) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useImperativeHandle(ref, () => ({
    resetCamera() {
      const controls = controlsRef.current;
      if (!controls) return;
      const cam = controls.object as THREE.PerspectiveCamera;
      cam.position.copy(CAM_POSITION);
      controls.target.copy(CAM_TARGET);
      controls.update();
    },
    zoomIn() {
      const controls = controlsRef.current;
      if (!controls) return;
      const cam = controls.object as THREE.PerspectiveCamera;
      const offset = cam.position.clone().sub(controls.target);
      const newLen = Math.max(controls.minDistance, offset.length() * 0.8);
      cam.position.copy(controls.target).addScaledVector(offset.normalize(), newLen);
      controls.update();
    },
    zoomOut() {
      const controls = controlsRef.current;
      if (!controls) return;
      const cam = controls.object as THREE.PerspectiveCamera;
      const offset = cam.position.clone().sub(controls.target);
      const newLen = Math.min(controls.maxDistance, offset.length() * 1.25);
      cam.position.copy(controls.target).addScaledVector(offset.normalize(), newLen);
      controls.update();
    },
  }));

  return (
    <Canvas
      camera={{ position: CAM_POSITION.toArray(), fov: 45 }}
      className="!bg-transparent"
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#88ddff" />
      <directionalLight position={[-5, 3, -3]} intensity={0.5} color="#ff99aa" />
      <pointLight position={[0, 2, 3]} intensity={0.5} color="#00d4ff" />

      <SceneControls controlsRef={controlsRef} />

      <Suspense fallback={<LoadingOverlay />}>
        <SceneErrorBoundary>
          <AnatomyModel
            system={system}
            opacity={opacity}
            onSelect={onSelect}
            selected={selected}
            showLabels={showLabels}
          />
        </SceneErrorBoundary>
      </Suspense>
    </Canvas>
  );
});

AnatomyScene.displayName = "AnatomyScene";
