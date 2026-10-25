import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { hasWebGL } from "@/lib/webgl";

/**
 * Mounts a WebGL scene only on the client, only when near the viewport and only
 * if WebGL is supported. `active` is false while offscreen so the render loop pauses.
 * The fallback is shown during SSR, while loading and on unsupported devices.
 */
export function Lazy3D({
  render,
  fallback,
  className,
  rootMargin = "300px",
  unsupported,
}: {
  render: (active: boolean) => ReactNode;
  fallback: ReactNode;
  className?: string;
  rootMargin?: string;
  /** Shown instead of the fallback when WebGL is unavailable. */
  unsupported?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setSupported(hasWebGL());
    const el = ref.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => e?.isIntersecting && setMounted(true), { rootMargin });
    const seen = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { threshold: 0.01 });
    near.observe(el);
    seen.observe(el);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {supported && mounted ? (
        <Suspense fallback={fallback}>{render(visible)}</Suspense>
      ) : supported === false && unsupported ? (
        unsupported
      ) : (
        fallback
      )}
    </div>
  );
}
