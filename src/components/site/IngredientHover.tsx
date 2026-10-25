import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useState } from "react";
import { ingredients, type Ingredient } from "@/lib/catalog";
import { LeafSprig } from "./Botanical";
import { Reveal } from "./Reveal";

const glow = ["var(--sage)", "var(--forest)", "var(--sage)", "var(--gold)", "var(--gold)", "var(--sage)"];
const layout = [
  "md:col-span-4 md:row-span-2",
  "md:col-span-3 md:mt-24",
  "md:col-span-3 md:col-start-10",
  "md:col-span-3 md:col-start-5 md:-mt-10",
  "md:col-span-4 md:col-start-9 md:mt-6",
  "md:col-span-3 md:col-start-2 md:-mt-16",
];

function Card({ ing, i, active, onActive }: { ing: Ingredient; i: number; active: boolean; onActive: (i: number | null) => void }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 14 });
  const sry = useSpring(ry, { stiffness: 120, damping: 14 });
  return (
    <motion.article
      tabIndex={0}
      aria-label={`${ing.name} — ${ing.origin}`}
      onFocus={() => onActive(i)}
      onBlur={() => onActive(null)}
      onPointerEnter={() => onActive(i)}
      onPointerLeave={() => {
        onActive(null);
        rx.set(0);
        ry.set(0);
      }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
      }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      className="group relative outline-none"
    >
      <motion.div
        animate={{ y: active && !reduce ? -10 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`relative overflow-hidden rounded-t-[999px] shadow-soft ${i === 0 ? "aspect-[3/4.4]" : "aspect-[3/4]"}`}
      >
        <img src={ing.image} alt={ing.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-[1.07] group-focus-visible:scale-[1.07]" />
        <motion.div
          initial={false}
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-3 bottom-3 rounded-sm bg-background/95 p-5 backdrop-blur"
        >
          <p className="eyebrow">{ing.origin}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ing.tradition}</p>
          <p className="mt-3 border-l border-gold pl-3 text-xs">{ing.usedIn}</p>
        </motion.div>
      </motion.div>
      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="font-display text-3xl transition-colors group-hover:text-accent">{ing.name}</h3>
        <span className="font-display text-lg italic text-muted-foreground">{ing.sanskrit}</span>
      </div>
    </motion.article>
  );
}

export function IngredientHover() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: active == null ? 0.35 : 0.75 }}
        transition={{ duration: 1 }}
        style={{
          background: `radial-gradient(ellipse at ${active == null ? "50% 40%" : `${20 + (active % 3) * 30}% ${active < 3 ? 35 : 65}%`}, color-mix(in oklab, ${glow[active ?? 0]} 30%, transparent) 0%, transparent 55%)`,
          transition: "background 1s var(--ease-lux)",
        }}
      />
      <LeafSprig className="pointer-events-none absolute -right-6 top-10 h-72 w-40 text-primary/15" />
      <div className="relative mx-auto max-w-[1440px] px-6 md:px-12">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Nature's finest ingredients</p>
          <h2 className="mt-4 font-display text-6xl leading-[0.95] md:text-8xl">
            Rooted in <em className="text-accent">Nature.</em>
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground">Hover or tap a plant to learn where it comes from and where you'll find it in our range.</p>
        </Reveal>
        <div className="mt-20 grid gap-x-8 gap-y-14 sm:grid-cols-2 md:grid-cols-12">
          {ingredients.map((ing, i) => (
            <Reveal key={ing.name} delay={(i % 3) * 0.08} className={layout[i] ?? ""}>
              <Card ing={ing} i={i} active={active === i} onActive={setActive} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
