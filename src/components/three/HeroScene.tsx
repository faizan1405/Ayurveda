import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, ContactShadows, Float, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { ModelSpec } from "@/lib/catalog";
import { ProductModel } from "./ProductModel";
import { Leaf, TurmericRoot } from "./Botanicals3D";
import { StudioLights } from "./StudioLights";
import { palette } from "./palette";

const heroSpec: ModelSpec = { kind: "dropper", glass: "#7a3d12", cap: "#262820", label: "Botanical Ritual Oil" };

/** Leaves at three depth bands; `d` scales how strongly each responds to the pointer. */
const leaves: { kind: "neem" | "tulsi"; p: [number, number, number]; r: [number, number, number]; s: number; d: number }[] = [
  { kind: "neem", p: [-1.45, 0.95, 0.9], r: [0.3, 0.4, 0.9], s: 1.25, d: 1.6 },
  { kind: "tulsi", p: [1.3, 1.1, -0.6], r: [-0.4, -0.6, -0.7], s: 1.3, d: 0.6 },
  { kind: "neem", p: [1.5, -0.45, 1.1], r: [0.6, -0.3, -1.9], s: 1, d: 1.8 },
  { kind: "tulsi", p: [-1.2, -0.7, 0.4], r: [0.2, 0.8, 2.2], s: 1.1, d: 1.2 },
  { kind: "neem", p: [-0.6, 1.5, -1.4], r: [-0.5, 0.2, 0.3], s: 0.9, d: 0.4 },
];

/** Pointer target that eases back to centre when the pointer leaves the window. */
function usePointerTarget() {
  const target = useRef(new THREE.Vector2());
  useEffect(() => {
    const move = (e: PointerEvent) => target.current.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1));
    const leave = () => target.current.set(0, 0);
    addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    addEventListener("blur", leave);
    return () => {
      removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      removeEventListener("blur", leave);
    };
  }, []);
  return target;
}

/** Critically-damped spring per axis — natural ease with no overshoot jitter. */
function spring(pos: THREE.Vector2, vel: THREE.Vector2, to: THREE.Vector2, dt: number, w = 5) {
  for (const k of ["x", "y"] as const) {
    const a = w * w * (to[k] - pos[k]) - 2 * w * vel[k];
    vel[k] += a * dt;
    pos[k] += vel[k] * dt;
  }
}

function Scene() {
  const target = usePointerTarget();
  const p = useMemo(() => new THREE.Vector2(), []);
  const pv = useMemo(() => new THREE.Vector2(), []);
  const product = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const leafRefs = useRef<(THREE.Group | null)[]>([]);
  const { camera } = useThree();

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    spring(p, pv, target.current, dt);
    camera.position.x = p.x * 0.35;
    camera.position.y = 0.15 + p.y * 0.2;
    camera.position.z = 8.6;
    camera.lookAt(0, -0.1, 0);
    if (product.current) {
      product.current.rotation.y = p.x * 0.45;
      product.current.rotation.x = -p.y * 0.12;
    }
    // Slow turntable that eases off while the user is steering.
    if (spin.current) spin.current.rotation.y += dt * 0.22 * (1 - Math.min(1, p.length()) * 0.7);
    leafRefs.current.forEach((g, i) => {
      if (!g) return;
      const d = leaves[i]!.d;
      g.position.x = p.x * 0.18 * d;
      g.position.y = p.y * 0.12 * d;
    });
  });

  return (
    <>
      <group ref={product}>
        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.35} floatingRange={[-0.06, 0.06]}>
          <group ref={spin}>
            <ProductModel spec={heroSpec} />
          </group>
        </Float>
      </group>
      {/* Honed stone plinth */}
      <mesh position={[0, -1.32, 0]}>
        <cylinderGeometry args={[0.95, 1.0, 0.22, 64]} />
        <meshStandardMaterial color={palette.ivory} roughness={0.6} emissive={palette.ivory} emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0, -1.205, 0]}>
        <cylinderGeometry args={[0.96, 0.96, 0.012, 64]} />
        <meshStandardMaterial color={palette.gold} metalness={0.35} roughness={0.45} />
      </mesh>
      {leaves.map((l, i) => (
        <group key={i} ref={(g) => { leafRefs.current[i] = g; }}>
          <Float speed={0.8 + (i % 3) * 0.25} rotationIntensity={0.35} floatIntensity={0.5}>
            <Leaf kind={l.kind} position={l.p} rotation={l.r} scale={l.s} />
          </Float>
        </group>
      ))}
      <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.4}>
        <TurmericRoot position={[0.95, -1.12, 0.75]} rotation={[0.2, 0.6, 0.1]} scale={1.1} />
      </Float>
    </>
  );
}

export default function HeroScene({ active }: { active: boolean }) {
  const [low, setLow] = useState(false);
  return (
    <Canvas
      frameloop={active ? "always" : "demand"}
      dpr={low ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0.15, 8.6], fov: 36 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
    >
      <PerformanceMonitor onDecline={() => setLow(true)} />
      <AdaptiveDpr pixelated={false} />
      <StudioLights />
      <Scene />
      {!low && <Sparkles count={18} scale={[4.5, 3.5, 2]} size={1.8} speed={0.2} opacity={0.5} color={palette.gold} />}
      <ContactShadows position={[0, -1.43, 0]} opacity={0.38} blur={2.6} scale={5} far={2} color={palette.forest} frames={active && !low ? Infinity : 1} />
    </Canvas>
  );
}
