import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { palette } from "./palette";

type GroupProps = { position?: [number, number, number]; rotation?: [number, number, number]; scale?: number };

/** A gently curved leaf built from a 2D shape (procedural, no external asset). */
function useLeafGeometry(width: number, length: number, curl: number) {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.quadraticCurveTo(width, length * 0.42, 0, length);
    s.quadraticCurveTo(-width, length * 0.42, 0, 0);
    const g = new THREE.ShapeGeometry(s, 16);
    const pos = g.attributes['position'] as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, -x * x * curl * 6 + Math.sin((y / length) * Math.PI) * curl * 0.6);
    }
    g.computeVertexNormals();
    return g;
  }, [width, length, curl]);
}

const leafKinds = {
  neem: { w: 0.08, l: 0.62, c: palette.neem },
  tulsi: { w: 0.2, l: 0.42, c: palette.tulsi },
  bhringraj: { w: 0.11, l: 0.55, c: palette.bhringraj },
};

export function Leaf({ kind, ...props }: GroupProps & { kind: keyof typeof leafKinds }) {
  const k = leafKinds[kind];
  const geo = useLeafGeometry(k.w, k.l, 0.25);
  return (
    <group {...props}>
      <mesh geometry={geo}>
        <meshStandardMaterial color={k.c} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, k.l * 0.45, 0.004]}>
        <boxGeometry args={[0.006, k.l * 0.9, 0.004]} />
        <meshStandardMaterial color={palette.amla} roughness={0.7} />
      </mesh>
    </group>
  );
}

export function TurmericRoot(props: GroupProps) {
  return (
    <group {...props}>
      {[
        [0, 0, 0, 0, 0, Math.PI / 2, 0.42],
        [0.16, 0.09, 0, 0, 0, Math.PI / 4, 0.24],
        [-0.12, 0.08, 0.02, 0, 0, -Math.PI / 3.5, 0.2],
      ].map(([x, y, z, rx, ry, rz, len], i) => (
        <mesh key={i} position={[x!, y!, z!]} rotation={[rx!, ry!, rz!]}>
          <capsuleGeometry args={[0.075, len!, 6, 12]} />
          <meshStandardMaterial color={palette.turmericSkin} roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0.29, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.072, 0.072, 0.01, 20]} />
        <meshStandardMaterial color={palette.turmericFlesh} roughness={0.6} />
      </mesh>
    </group>
  );
}

export function Amla(props: GroupProps) {
  return (
    <group {...props}>
      <mesh scale={[1, 0.9, 1]}>
        <sphereGeometry args={[0.2, 32, 24]} />
        <meshPhysicalMaterial color={palette.amla} roughness={0.3} clearcoat={0.6} />
      </mesh>
      <mesh position-y={0.18}>
        <cylinderGeometry args={[0.008, 0.012, 0.06, 6]} />
        <meshStandardMaterial color={palette.coconut} />
      </mesh>
    </group>
  );
}

export function CoconutHalf(props: GroupProps) {
  return (
    <group {...props}>
      <mesh rotation-x={Math.PI}>
        <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={palette.coconut} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.001}>
        <ringGeometry args={[0.0, 0.27, 40]} />
        <meshStandardMaterial color={palette.ivory} roughness={0.7} />
      </mesh>
    </group>
  );
}

/** Small instanced scatter of seeds (one draw call). Positions are deterministic. */
export function SesameSeeds({ count = 24, spread = 0.6, ...props }: GroupProps & { count?: number; spread?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const a = i * 2.399963;
      const r = Math.sqrt(i / count) * spread;
      m.position.set(Math.cos(a) * r, Math.sin(i * 1.7) * 0.08, Math.sin(a) * r);
      m.rotation.set(i * 0.7, i * 1.3, i * 0.4);
      m.scale.set(0.034, 0.012, 0.055);
      m.updateMatrix();
      ref.current?.setMatrixAt(i, m.matrix);
    }
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [count, spread]);
  return (
    <group {...props}>
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color={palette.sesame} roughness={0.6} />
      </instancedMesh>
    </group>
  );
}
