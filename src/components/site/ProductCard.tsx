import { Link } from "@tanstack/react-router";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { formatPrice, type Product } from "@/lib/catalog";
import { LeafSprig } from "./Botanical";

const tones = {
  sage: "bg-sage/25 group-hover:bg-sage/45",
  linen: "bg-linen group-hover:bg-gold/25",
  terracotta: "bg-terracotta/15 group-hover:bg-terracotta/30",
};

const MAX_TILT = 6;

export function ProductCard({ product, tall }: { product: Product; tall?: boolean }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 16 });
  const sry = useSpring(ry, { stiffness: 140, damping: 16 });
  const sx = useTransform(sry, (v) => -v * 2.5);
  const sy = useTransform(srx, (v) => 34 + v * 2.5);
  const shadow = useMotionTemplate`${sx}px ${sy}px 60px -30px color-mix(in oklab, var(--forest) 40%, transparent)`;

  return (
    <Link
      to="/shop/$slug"
      params={{ slug: product.slug }}
      className="group block focus-visible:outline-none"
      data-cursor="View"
    >
      <motion.div
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * MAX_TILT * 2);
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * MAX_TILT * 2);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000, boxShadow: shadow }}
        className={`relative overflow-hidden rounded-t-[999px] transition-colors duration-700 ${tones[product.tone]} ${
          tall ? "aspect-[3/4.4]" : "aspect-[3/4]"
        }`}
      >
        <LeafSprig className="absolute -right-4 top-8 h-40 w-24 text-primary/25 transition-transform duration-[1.2s] ease-[var(--ease-lux)] group-hover:-translate-y-3 group-hover:rotate-6" />
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={912}
          height={1104}
          className="absolute inset-0 h-full w-full object-cover mix-blend-multiply transition-transform duration-[1.4s] ease-[var(--ease-lux)] group-hover:-translate-y-2 group-hover:scale-[1.06]"
        />
        {product.model && (
          <span className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full bg-background/90 px-3 py-1 text-[0.58rem] uppercase tracking-[0.22em] opacity-0 transition-opacity duration-700 group-hover:opacity-100">
            3D view
          </span>
        )}
        <div className="absolute inset-x-4 bottom-4 flex translate-y-6 items-center justify-between rounded-full bg-background/95 px-5 py-3 opacity-0 transition-all duration-700 ease-[var(--ease-lux)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <span className="text-[0.68rem] uppercase tracking-[0.22em]">View details</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.3} />
        </div>
      </motion.div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">
            {product.category} · {product.sizes.join(" / ")}
          </p>
          <h3 className="mt-1 font-display text-2xl leading-tight transition-colors group-hover:text-accent">{product.name}</h3>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">{product.short}</p>
        </div>
        <span className="whitespace-nowrap pt-5 text-sm">{formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}
