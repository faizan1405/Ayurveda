import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { useRef, type ComponentRef } from "react";
import { RotateCcw, Images } from "lucide-react";
import type { ModelSpec } from "@/lib/catalog";
import { ProductModel } from "./ProductModel";
import { StudioLights } from "./StudioLights";

export default function ProductViewer({ spec, active, onExit }: { spec: ModelSpec; active: boolean; onExit: () => void }) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing" data-cursor="Drag to rotate">
        <Canvas frameloop={active ? "always" : "demand"} dpr={[1, 1.75]} camera={{ position: [0, 0.3, 4.6], fov: 35 }} gl={{ alpha: true, antialias: true }}>
          <StudioLights />
          <ProductModel spec={spec} />
          <ContactShadows position={[0, spec.kind === "jar" ? -0.62 : -1.22, 0]} opacity={0.3} blur={2.4} scale={5} far={2} color="#284537" />
          <OrbitControls
            ref={controls}
            makeDefault
            enablePan={false}
            enableDamping
            minDistance={2.6}
            maxDistance={6.5}
            minPolarAngle={0.45}
            maxPolarAngle={Math.PI / 1.75}
            autoRotate
            autoRotateSpeed={0.7}
          />
        </Canvas>
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => controls.current?.reset()}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-background/95 px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.2em] shadow-soft transition-colors hover:text-accent"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.4} /> Reset view
        </button>
        <button
          type="button"
          onClick={onExit}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-background/95 px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.2em] shadow-soft transition-colors hover:text-accent"
        >
          <Images className="h-3.5 w-3.5" strokeWidth={1.4} /> Photos
        </button>
      </div>
      <p className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-full bg-background/90 px-4 py-2 text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">
        Demo 3D form · not final packaging · drag, pinch or scroll
      </p>
    </div>
  );
}
