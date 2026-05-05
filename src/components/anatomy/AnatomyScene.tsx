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

// ─── CDN base ────────────────────────────────────────────────────────────────
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

// Per-system Y-axis rotation fix (radians).
// If a model faces backward, set it to Math.PI; if sideways, Math.PI / 2.
const SYSTEM_Y_ROTATION: Record<string, number> = {
  skeletal:  Math.PI,   // faces -Z → rotate 180°
  nervous:   Math.PI,   // faces -Z → rotate 180°
};

// Camera defaults
const CAM_POS    = new THREE.Vector3(0, 0, 3.5);
const CAM_TARGET = new THREE.Vector3(0, 0, 0);

useGLTF.setDecoderPath("/draco/");

// ─── Exposed handle ───────────────────────────────────────────────────────────
export interface AnatomySceneHandle {
  resetCamera: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

// ─── Error boundary ───────────────────────────────────────────────────────────
interface EBState { error: Error | null }
class SceneErrorBoundary extends Component<
  { children: ReactNode; onReset?: () => void },
  EBState
> {
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

// ─── Model ────────────────────────────────────────────────────────────────────
// KEY POINT: receives `system` as a key prop from parent so it fully
// unmounts/remounts on every system change → no stale group state.
function AnatomyModel({
  system,
  opacity,
  onSelect,
  selected,
  showLabels,
  onReady,
}: {
  system: string;
  opacity: number;
  onSelect: (name: string) => void;
  selected: string | null;
  showLabels: boolean;
  onReady: () => void;
}) {
  const url   = MODEL_URLS[system] ?? MODEL_URLS.muscular;
  const { scene: raw } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  // Clone scene + materials so mutations never leak between system switches
  const scene = useMemo(() => {
    const cloned = raw.clone(true);
    cloned.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mesh = obj as THREE.Mesh;
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.clone())
        : mesh.material.clone();
    });
    return cloned;
  }, [raw]);

  // Opacity (on the already-cloned materials – safe)
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

  // Centre + uniform scale, then notify parent so camera can reset
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    // Reset any previous transforms BEFORE computing the box
    group.scale.setScalar(1);
    group.position.set(0, 0, 0);
    group.rotation.set(0, SYSTEM_Y_ROTATION[system] ?? 0, 0);

    const box    = new THREE.Box3().setFromObject(group);
    const size   = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale  = 2.2 / maxDim;

    group.scale.setScalar(scale);
    // Re-centre after scaling: negate the world-space centre
    group.position.set(
      -centre.x * scale,
      -centre.y * scale,
      -centre.z * scale,
    );

    // Tell parent the model is positioned → safe to reset camera now
    onReady();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);          // only re-run when the scene object itself changes

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
        <Html distanceFactor={8} position={[0, 1.5, 0]} center>
          <div className="px-2 py-1 rounded-md bg-card border border-primary/40 text-xs whitespace-nowrap shadow-elegant pointer-events-none">
            {selected}
          </div>
        </Html>
      )}
    </group>
  );
}

// ─── Inner canvas content (has access to useThree) ───────────────────────────
function SceneContent({
  system,
  opacity,
  onSelect,
  selected,
  showLabels,
  controlsRef,
  resetCam,
}: {
  system: string;
  opacity: number;
  onSelect: (name: string) => void;
  selected: string | null;
  showLabels: boolean;
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  resetCam: () => void;
}) {
  const { camera } = useThree();

  // Place camera at default on first mount
  useEffect(() => {
    camera.position.copy(CAM_POS);
    camera.lookAt(CAM_TARGET);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Immediately snap camera back whenever the system changes (before model loads)
  useEffect(() => {
    resetCam();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [system]);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan
        enableZoom
        enableRotate
        minDistance={0.8}
        maxDistance={14}
        target={[CAM_TARGET.x, CAM_TARGET.y, CAM_TARGET.z]}
        makeDefault
      />
      <Suspense fallback={<LoadingOverlay />}>
        {/* key={system} forces full remount → clean groupRef state every switch */}
        <SceneErrorBoundary key={system}>
          <AnatomyModel
            key={system}
            system={system}
            opacity={opacity}
            onSelect={onSelect}
            selected={selected}
            showLabels={showLabels}
            onReady={resetCam}  // reset camera again after model is positioned
          />
        </SceneErrorBoundary>
      </Suspense>
    </>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
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
      <directionalLight position={[5, 5, 5]}  intensity={1.2} color="#88ddff" />
      <directionalLight position={[-5, 3, -3]} intensity={0.5} color="#ff99aa" />
      <pointLight       position={[0, 2, 3]}   intensity={0.5} color="#00d4ff" />

      <SceneContent
        system={system}
        opacity={opacity}
        onSelect={onSelect}
        selected={selected}
        showLabels={showLabels}
        controlsRef={controlsRef}
        resetCam={resetCam}
      />
    </Canvas>
  );
});

AnatomyScene.displayName = "AnatomyScene";
