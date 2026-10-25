import { Environment, Lightformer } from "@react-three/drei";
import { palette } from "./palette";

/** Soft botanical studio lighting. Local Lightformers only — no CDN HDR presets. */
export function StudioLights({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <ambientLight intensity={0.45 * intensity} color={palette.warmLight} />
      <directionalLight position={[3, 5, 4]} intensity={2.2 * intensity} color={palette.warmLight} />
      <directionalLight position={[-4, 2, -3]} intensity={0.9 * intensity} color={palette.coolLight} />
      <Environment resolution={128}>
        <Lightformer intensity={2.4} position={[0, 4, 3]} scale={[6, 3, 1]} color={palette.warmLight} />
        <Lightformer intensity={1.2} position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} color={palette.coolLight} />
        <Lightformer intensity={1.4} position={[5, 0.5, 1]} rotation-y={-Math.PI / 2} scale={[3, 6, 1]} color={palette.gold} />
        <Lightformer intensity={0.6} position={[0, -3, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} color={palette.ivory} />
      </Environment>
    </>
  );
}
