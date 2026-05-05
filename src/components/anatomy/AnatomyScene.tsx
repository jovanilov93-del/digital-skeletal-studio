import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei";
import {
  Suspense,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
  Component,
  ReactNode,
} from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

// ─── CDN ─────────────────────────────────────────────────────────────────────
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

// Y-axis rotation fix for models exported facing away from camera
const SYSTEM_Y_ROTATION: Record<string, number> = {
  skeletal: Math.PI,
  nervous:  Math.PI,
};

// Highlight colour for selected mesh
const HIGHLIGHT_COLOR = new THREE.Color("#00ccff");

const CAM_POS    = new THREE.Vector3(0, 0, 3.5);
const CAM_TARGET = new THREE.Vector3(0, 0, 0);

useGLTF.setDecoderPath("/draco/");

// ─── Public handle ────────────────────────────────────────────────────────────
export interface AnatomySceneHandle {
  resetCamera: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

// ─── Error boundary ───────────────────────────────────────────────────────────
interface EBState { error: Error | null }
class SceneErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { error: null };
  static getDerivedStateFromError(e: Error): EBState { return { error: e }; }
  render() {
    if (this.state.error)
      return (
        <Html center>
          <div className="text-center text-xs px-4 max-w-[220px]">
            <p className="font-semibold mb-1 text-destructive">Could not load model</p>
            <p className="text-muted-foreground opacity-70">{this.state.error.message}</p>
          </div>
        </Html>
      );
    return this.props.children;
  }
}

// ─── Loading bar ──────────────────────────────────────────────────────────────
function LoadingOverlay() {
  const { progress, active } = useProgress();
  if (!active) return null;
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 min-w-[180px]">
        <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-200"
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getPrimaryMat(mesh: THREE.Mesh): THREE.MeshStandardMaterial | null {
  const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  return (mat as THREE.MeshStandardMaterial) ?? null;
}

// ─── Model ────────────────────────────────────────────────────────────────────
function AnatomyModel({
  system,
  opacity,
  onSelect,
  selected,
  onReady,
}: {
  system: string;
  opacity: number;
  onSelect: (name: string) => void;
  selected: string | null;
  onReady: () => void;
}) {
  const url = MODEL_URLS[system] ?? MODEL_URLS.muscular;
  const { scene: raw } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  // Refs for highlight tracking
  const highlightedMesh        = useRef<THREE.Mesh | null>(null);
  const savedEmissive          = useRef(new THREE.Color(0, 0, 0));
  const savedEmissiveIntensity = useRef(0);

  // Clone scene + materials – each mount gets its own independent copy
  const scene = useMemo(() => {
    const cloned = raw.clone(true);
    cloned.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mesh = obj as THREE.Mesh;
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.clone())
        : (mesh.material as THREE.Material).clone();
    });
    return cloned;
  }, [raw]);

  // Apply opacity to cloned materials
  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mats = Array.isArray((obj as THREE.Mesh).material)
        ? ((obj as THREE.Mesh).material as THREE.MeshStandardMaterial[])
        : [(obj as THREE.Mesh).material as THREE.MeshStandardMaterial];
      mats.forEach((m) => {
        m.transparent = opacity < 1;
        m.opacity     = opacity;
        m.needsUpdate = true;
      });
    });
  }, [scene, opacity]);

  // De-highlight when selection cleared externally (reset button)
  useEffect(() => {
    if (selected !== null) return;
    const mesh = highlightedMesh.current;
    if (!mesh) return;
    const mat = getPrimaryMat(mesh);
    if (mat) {
      mat.emissive.copy(savedEmissive.current);
      mat.emissiveIntensity = savedEmissiveIntensity.current;
    }
    highlightedMesh.current = null;
  }, [selected]);

  // Centre + scale, reset transforms first to avoid stale state
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    group.scale.setScalar(1);
    group.position.set(0, 0, 0);
    group.rotation.set(0, SYSTEM_Y_ROTATION[system] ?? 0, 0);

    const box    = new THREE.Box3().setFromObject(group);
    const size   = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const scale  = 2.2 / Math.max(size.x, size.y, size.z);

    group.scale.setScalar(scale);
    group.position.set(-centre.x * scale, -centre.y * scale, -centre.z * scale);

    onReady();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  // Click handler – highlight clicked mesh, restore previous
  const handleClick = useCallback(
    (e: { stopPropagation: () => void; object: THREE.Object3D }) => {
      e.stopPropagation();
      const clicked = e.object as THREE.Mesh;
      if (!clicked.isMesh) return;

      // Restore previously highlighted mesh
      const prev = highlightedMesh.current;
      if (prev && prev !== clicked) {
        const mat = getPrimaryMat(prev);
        if (mat) {
          mat.emissive.copy(savedEmissive.current);
          mat.emissiveIntensity = savedEmissiveIntensity.current;
        }
        highlightedMesh.current = null;
      }

      // Highlight newly clicked mesh
      if (prev !== clicked) {
        const mat = getPrimaryMat(clicked);
        if (mat) {
          savedEmissive.current.copy(mat.emissive);
          savedEmissiveIntensity.current = mat.emissiveIntensity;
          mat.emissive.copy(HIGHLIGHT_COLOR);
          mat.emissiveIntensity = 0.55;
        }
        highlightedMesh.current = clicked;
        onSelect(clicked.name || system);
      }
    },
    [onSelect, system],
  );

  return (
    <group ref={groupRef}>
      <primitive object={scene} onClick={handleClick} />
    </group>
  );
}

// ─── Inner canvas content ─────────────────────────────────────────────────────
function SceneContent({
  system,
  opacity,
  onSelect,
  selected,
  controlsRef,
  resetCam,
}: {
  system: string;
  opacity: number;
  onSelect: (name: string) => void;
  selected: string | null;
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  resetCam: () => void;
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.copy(CAM_POS);
    camera.lookAt(CAM_TARGET);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Snap camera back the moment the system changes (before model loads)
  useEffect(() => {
    resetCam();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [system]);

  return (
    <>
      {/* Full 360° rotation, panning, zooming, smooth damping */}
      <OrbitControls
        ref={controlsRef}
        enablePan
        enableZoom
        enableRotate
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.7}
        minDistance={0.8}
        maxDistance={14}
        // No polar angle limits → free vertical rotation all the way around
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        makeDefault
      />

      <Suspense fallback={<LoadingOverlay />}>
        {/* key forces full remount on every switch → clean state */}
        <SceneErrorBoundary key={system}>
          <AnatomyModel
            key={system}
            system={system}
            opacity={opacity}
            onSelect={onSelect}
            selected={selected}
            onReady={resetCam}
          />
        </SceneErrorBoundary>
      </Suspense>
    </>
  );
}

// ─── Exported component ───────────────────────────────────────────────────────
export const AnatomyScene = forwardRef<
  AnatomySceneHandle,
  {
    system: string;
    onSelect: (id: string) => void;
    selected: string | null;
    opacity?: number;
    showLabels?: boolean;
  }
>(({ system, onSelect, selected, opacity = 1 }, ref) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const resetCam = useCallback(() => {
    const ctrl = controlsRef.current;
    if (!ctrl) return;
    (ctrl.object as THREE.PerspectiveCamera).position.copy(CAM_POS);
    ctrl.target.copy(CAM_TARGET);
    ctrl.update();
  }, []);

  useImperativeHandle(ref, () => ({
    resetCamera: resetCam,
    zoomIn() {
      const ctrl = controlsRef.current;
      if (!ctrl) return;
      const cam    = ctrl.object as THREE.PerspectiveCamera;
      const offset = cam.position.clone().sub(ctrl.target);
      const newLen = Math.max(ctrl.minDistance, offset.length() * 0.75);
      cam.position.copy(ctrl.target).addScaledVector(offset.normalize(), newLen);
      ctrl.update();
    },
    zoomOut() {
      const ctrl = controlsRef.current;
      if (!ctrl) return;
      const cam    = ctrl.object as THREE.PerspectiveCamera;
      const offset = cam.position.clone().sub(ctrl.target);
      const newLen = Math.min(ctrl.maxDistance, offset.length() * 1.33);
      cam.position.copy(ctrl.target).addScaledVector(offset.normalize(), newLen);
      ctrl.update();
    },
  }), [resetCam]);

  return (
    <Canvas
      camera={{ position: CAM_POS.toArray(), fov: 45 }}
      className="!bg-transparent"
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]}   intensity={1.2} color="#88ddff" />
      <directionalLight position={[-5, 3, -3]}  intensity={0.5} color="#ff99aa" />
      <pointLight       position={[0, 2, 3]}    intensity={0.5} color="#00d4ff" />

      <SceneContent
        system={system}
        opacity={opacity}
        onSelect={onSelect}
        selected={selected}
        controlsRef={controlsRef}
        resetCam={resetCam}
      />
    </Canvas>
  );
});

AnatomyScene.displayName = "AnatomyScene";
