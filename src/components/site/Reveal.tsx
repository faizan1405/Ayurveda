import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 30,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Image that unveils with a clip-path wipe as it enters view. */
export function MaskImage({
  src,
  alt,
  className,
  imgClassName,
  from = "bottom",
  eager,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  from?: "bottom" | "left" | "right";
  eager?: boolean;
}) {
  const reduce = useReducedMotion();
  const clip = {
    bottom: "inset(100% 0 0 0)",
    left: "inset(0 100% 0 0)",
    right: "inset(0 0 0 100%)",
  }[from];
  return (
    <motion.div
      className={`overflow-hidden ${className ?? ""}`}
      initial={{ clipPath: reduce ? "inset(0 0 0 0)" : clip }}
      whileInView={{ clipPath: "inset(0 0 0 0)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.4, ease }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        className={`h-full w-full object-cover ${imgClassName ?? ""}`}
        initial={{ scale: reduce ? 1 : 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease }}
      />
    </motion.div>
  );
}

export function SplitLines({ lines, className, delay = 0 }: { lines: string[]; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, delay: delay + i * 0.14, ease }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
