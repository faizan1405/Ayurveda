import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import type { ModelSpec } from "@/lib/catalog";
import { ProductModel } from "./ProductModel";
import { Amla, CoconutHalf, Leaf, SesameSeeds } from "./Botanicals3D";
import { StudioLights } from "./StudioLights";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const seg = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Ingredients of the showcased (sample) Amla & Bhringraj Hair Oil only. */
const layers: { el: "amla" | "leaf" | "coconut" | "sesame"; p: [number, number, number]; r: [number, number, number]; s: number; d: number }[] = [
  { el: "amla", p: [-1.05, 0.55, 0.4], r: [0, 0, 0], s: 1.2, d: 0 },
  { el: "amla", p: [1.2, -0.65, 0.2], r: [0, 0, 0], s: 0.9, d: 0.05 },
  { el: "leaf", p: [1.05, 0.85, -0.4], r: [-0.3, -0.5, -0.8], s: 1.3, d: 0.02 },
  { el: "leaf", p: [-1.25, -0.45, -0.2], r: [0.3, 0.6, 2.1], s: 1.1, d: 0.07 },
  { el: "coconut", p: [0.95, -1.15, -0.6], r: [0.5, 0, 0.2], s: 1, d: 0.1 },
  { el: "sesame", p: [-0.8, -1.2, 0.5], r: [0.2, 0, 0], s: 1, d: 0.12 },
];

function Product({ progress, spec }: { progress: MutableRefObject<{ p: number }>; spec: ModelSpec }) {
  const group = useRef<THREE.Group>(null);
  const items = useRef<(THREE.Group | null)[]>([]);
  const smooth = useRef(0);

  useFrame(({ camera, clock }, raw) => {
    const dt = Math.min(raw, 0.05);
    smooth.current += (progress.current.p - smooth.current) * (1 - Math.exp(-6 * dt));
    const p = smooth.current;
    const g = group.current;
    if (!g) return;

    // Stage 2 — rotate ~80°
    g.rotation.y = seg(p, 0.12, 0.4) * Math.PI * 0.45 + Math.sin(clock.elapsedTime * 0.4) * 0.04;
    // Stage 5 — slide aside for information; Stage 6 — rise out
    g.position.x = -seg(p, 0.62, 0.8) * 0.85;
    g.position.y = seg(p, 0.88, 1) * 0.9;
    const sc = 1 - seg(p, 0.88, 1) * 0.25;
    g.scale.setScalar(sc);

    // Stage 3 — camera moves closer to the label, then eases back
    const close = seg(p, 0.32, 0.52) - seg(p, 0.62, 0.8) * 0.7;
    camera.position.set(0, 0.2 + close * 0.15, 6.2 - close * 1.4);
    camera.lookAt(g.position.x * 0.4, close * 0.1, 0);

    // Stage 4 — botanicals appear in layers
    items.current.forEach((it, i) => {
      if (!it) return;
      const l = layers[i]!;
      const t = seg(p, 0.46 + l.d, 0.6 + l.d) * (1 - seg(p, 0.9, 1));
      it.scale.setScalar(Math.max(0.0001, t * l.s));
      it.position.set(l.p[0] - seg(p, 0.62, 0.8) * 0.85, l.p[1] + (1 - t) * 0.4, l.p[2]);
    });
  });

  return (
    <>
      <group ref={group}>
        <ProductModel spec={spec} />
      </group>
      {layers.map((l, i) => (
        <group key={i} ref={(el) => { items.current[i] = el; }} rotation={l.r}>
          <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.5}>
            {l.el === "amla" && <Amla />}
            {l.el === "leaf" && <Leaf kind="bhringraj" />}
            {l.el === "coconut" && <CoconutHalf />}
            {l.el === "sesame" && <SesameSeeds spread={0.35} />}
          </Float>
        </group>
      ))}
    </>
  );
}

export default function StoryScene({
  active,
  progress,
  spec,
}: {
  active: boolean;
  progress: MutableRefObject<{ p: number }>;
  spec: ModelSpec;
}) {
  return (
    <Canvas frameloop={active ? "always" : "demand"} dpr={[1, 1.5]} camera={{ position: [0, 0.2, 6.2], fov: 32 }} gl={{ alpha: true, antialias: true }}>
      <StudioLights intensity={1.1} />
      <Product progress={progress} spec={spec} />
      <ContactShadows position={[0, -1.4, 0]} opacity={0.3} blur={2.6} scale={6} far={2.5} color="#284537" frames={active ? Infinity : 1} />
    </Canvas>
  );
}
