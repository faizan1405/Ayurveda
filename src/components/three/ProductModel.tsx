import { useMemo } from "react";
import * as THREE from "three";
import type { ModelSpec } from "@/lib/catalog";
import { palette } from "./palette";

/**
 * DEMO PACKAGING — a procedurally built bottle/jar used as a placeholder until
 * the brand supplies real GLB product models. It does not represent real packaging.
 * Parts (glass, liquid, collar, cap, pipette) are separate meshes so a GLB swap
 * or an exploded view can address them individually.
 */

const v = (x: number, y: number) => new THREE.Vector2(x, y);

/** Outer silhouette with a thick base and rounded shoulder, plus the fill level of the inner liquid. */
const profiles = {
  dropper: {
    body: [v(0, 0.06), v(0.44, 0.06), v(0.5, 0), v(0.545, 0.03), v(0.56, 0.1), v(0.562, 0.6), v(0.56, 1.1), v(0.54, 1.22), v(0.48, 1.32), v(0.36, 1.42), v(0.23, 1.48), v(0.2, 1.52), v(0.2, 1.62)],
    fill: 1.12,
    label: { r: 0.572, h: 0.7, y: 0.6 },
    height: 2.35,
  },
  bottle: {
    body: [v(0, 0.06), v(0.4, 0.06), v(0.45, 0), v(0.49, 0.03), v(0.5, 0.1), v(0.502, 0.8), v(0.5, 1.45), v(0.48, 1.56), v(0.4, 1.68), v(0.26, 1.78), v(0.17, 1.84), v(0.165, 1.96)],
    fill: 1.4,
    label: { r: 0.512, h: 0.86, y: 0.72 },
    height: 2.4,
  },
  jar: {
    body: [v(0, 0.08), v(0.66, 0.08), v(0.72, 0), v(0.755, 0.04), v(0.762, 0.12), v(0.762, 0.74), v(0.72, 0.8), v(0.69, 0.84), v(0.69, 0.92)],
    fill: 0.7,
    label: { r: 0.772, h: 0.46, y: 0.4 },
    height: 1.2,
  },
} as const;

/** Shrinks a profile inward (for the liquid) and clips it at the fill height. */
function liquidProfile(body: readonly THREE.Vector2[], fill: number, inset: number) {
  const pts: THREE.Vector2[] = [];
  for (const p of body) {
    if (p.y > fill) break;
    pts.push(v(Math.max(0, p.x - inset), Math.max(p.y, 0.09)));
  }
  const last = pts[pts.length - 1]!;
  pts.push(v(last.x, fill), v(0, fill));
  return pts;
}

/** Fine vertical ridges for caps, giving the grip texture real caps have. */
function ridgedCap(radius: number, height: number, ridges: number) {
  const g = new THREE.CylinderGeometry(radius, radius, height, ridges * 2, 1);
  const pos = g.attributes["position"] as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const r = Math.hypot(x, z);
    if (r < radius * 0.98) continue;
    const a = Math.atan2(z, x);
    const k = 1 + Math.cos(a * ridges) * 0.025;
    pos.setX(i, x * k);
    pos.setZ(i, z * k);
  }
  g.computeVertexNormals();
  return g;
}

function useLabelTexture(title: string) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const g = c.getContext("2d")!;
    // Warm uncoated paper with faint fibre grain.
    g.fillStyle = palette.ivory;
    g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = `rgba(120,95,60,${Math.random() * 0.05})`;
      g.fillRect(Math.random() * 1024, Math.random() * 512, 1 + Math.random() * 3, 1);
    }
    g.strokeStyle = palette.gold;
    g.lineWidth = 4;
    g.strokeRect(300, 46, 424, 420);
    g.lineWidth = 1.2;
    g.strokeRect(312, 58, 400, 396);
    g.textAlign = "center";
    g.fillStyle = palette.forest;
    g.font = "600 28px Manrope, sans-serif";
    g.fillText("A  N  A  N  T  A", 512, 128);
    g.fillStyle = palette.gold;
    g.beginPath();
    g.ellipse(512, 188, 12, 28, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = palette.charcoal;
    const words = title.split(" ");
    const mid = Math.ceil(words.length / 2);
    g.font = "italic 54px 'Cormorant Garamond', Georgia, serif";
    g.fillText(words.slice(0, mid).join(" "), 512, 288);
    g.fillText(words.slice(mid).join(" "), 512, 346);
    g.fillStyle = palette.terracotta;
    g.font = "500 18px Manrope, sans-serif";
    g.fillText("DEMO PACKAGING", 512, 420);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [title]);
}

export function ProductModel({ spec }: { spec: ModelSpec }) {
  const p = profiles[spec.kind];
  const body = useMemo(() => new THREE.LatheGeometry(p.body as unknown as THREE.Vector2[], 72), [p]);
  const liquid = useMemo(
    () => new THREE.LatheGeometry(liquidProfile(p.body as unknown as THREE.Vector2[], p.fill, spec.kind === "jar" ? 0.05 : 0.035), 64),
    [p, spec.kind],
  );
  const capGeo = useMemo(() => ridgedCap(spec.kind === "jar" ? 0.79 : 0.21, spec.kind === "jar" ? 0.26 : 0.4, spec.kind === "jar" ? 90 : 36), [spec.kind]);
  const label = useLabelTexture(spec.label);
  const offset = -p.height / 2;
  const tint = useMemo(() => new THREE.Color(spec.glass), [spec.glass]);
  const liquidColor = useMemo(() => tint.clone().offsetHSL(0, 0.08, -0.08), [tint]);

  const glass = (
    <meshPhysicalMaterial
      color={tint.clone().lerp(new THREE.Color("#ffffff"), 0.35)}
      transmission={spec.kind === "jar" ? 0.2 : 0.92}
      thickness={0.6}
      ior={1.5}
      roughness={spec.kind === "jar" ? 0.3 : 0.04}
      attenuationColor={tint}
      attenuationDistance={0.9}
      clearcoat={1}
      clearcoatRoughness={0.04}
      specularIntensity={1}
      envMapIntensity={1.6}
      transparent={spec.kind !== "jar"}
    />
  );
  const gold = <meshStandardMaterial color={palette.gold} metalness={1} roughness={0.22} envMapIntensity={1.3} />;

  return (
    <group position-y={offset}>
      {/* Liquid sits inside the glass and is drawn first so the glass refracts it. */}
      {spec.kind !== "jar" && (
        <mesh geometry={liquid} renderOrder={0}>
          <meshPhysicalMaterial color={liquidColor} roughness={0.15} transmission={0.55} thickness={1} ior={1.47} envMapIntensity={0.8} />
        </mesh>
      )}
      <mesh geometry={body} renderOrder={1}>{glass}</mesh>
      <mesh position-y={p.label.y} renderOrder={2}>
        <cylinderGeometry args={[p.label.r, p.label.r, p.label.h, 72, 1, true, -Math.PI * 0.55, Math.PI * 1.1]} />
        <meshStandardMaterial map={label} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {spec.kind === "dropper" && (
        <>
          {/* Glass pipette reaching into the oil */}
          <mesh position-y={1.12}>
            <cylinderGeometry args={[0.045, 0.03, 1.0, 20, 1, true]} />
            <meshPhysicalMaterial color="#ffffff" transmission={1} thickness={0.1} roughness={0.02} transparent />
          </mesh>
          <mesh position-y={1.6}>
            <cylinderGeometry args={[0.215, 0.215, 0.05, 48]} />
            {gold}
          </mesh>
          <mesh position-y={1.72}>
            <cylinderGeometry args={[0.235, 0.225, 0.2, 48]} />
            {gold}
          </mesh>
          <mesh position-y={1.82}>
            <latheGeometry args={[[v(0, 0), v(0.15, 0), v(0.17, 0.08), v(0.165, 0.3), v(0.13, 0.44), v(0.07, 0.52), v(0, 0.54)], 48]} />
            <meshPhysicalMaterial color={spec.cap} roughness={0.45} clearcoat={0.4} clearcoatRoughness={0.5} />
          </mesh>
        </>
      )}
      {spec.kind === "bottle" && (
        <mesh position-y={2.12} geometry={capGeo}>
          {gold}
        </mesh>
      )}
      {spec.kind === "jar" && (
        <>
          <mesh position-y={1.0} geometry={capGeo}>
            <meshStandardMaterial color={spec.cap} roughness={0.5} metalness={0.15} />
          </mesh>
          <mesh position-y={1.135}>
            <cylinderGeometry args={[0.6, 0.79, 0.02, 72]} />
            {gold}
          </mesh>
        </>
      )}
    </group>
  );
}
