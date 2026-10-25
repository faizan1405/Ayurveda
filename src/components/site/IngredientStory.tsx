import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ingredients, type Ingredient } from "@/lib/catalog";

function Chapter({ ing, index, onActive }: { ing: Ingredient; index: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);
  return (
    <div ref={ref} className="flex min-h-[80vh] flex-col justify-center py-16">
      <img src={ing.image} alt={ing.name} loading="lazy" className="mb-8 aspect-[4/5] w-full rounded-t-[999px] object-cover lg:hidden" />
      <motion.div
        animate={{ opacity: inView ? 1 : 0.25 }}
        transition={{ duration: 0.8 }}
        className="max-lg:!opacity-100"
      >
        <p className="eyebrow">
          {String(index + 1).padStart(2, "0")} — {ing.origin}
        </p>
        <h3 className="mt-4 font-display text-6xl md:text-7xl">{ing.name}</h3>
        <p className="mt-1 font-display text-2xl italic text-accent">{ing.sanskrit}</p>
        <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">{ing.tradition}</p>
        <p className="mt-6 max-w-md border-l border-gold pl-4 text-sm">{ing.usedIn}</p>
      </motion.div>
    </div>
  );
}

export function IngredientStory() {
  const [active, setActive] = useState(0);
  return (
    <div className="mx-auto grid max-w-[1440px] gap-12 px-6 md:px-12 lg:grid-cols-2 lg:gap-24">
      <div className="sticky top-0 hidden h-screen items-center lg:flex">
        <div className="relative aspect-[4/5] w-full max-w-[560px] overflow-hidden rounded-t-[999px] bg-linen">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={active}
              src={ingredients[active]!.image}
              alt={ingredients[active]!.name}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.15 }}
              animate={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>
          <div className="absolute bottom-6 left-6 rounded-full bg-background/90 px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em]">
            {String(active + 1).padStart(2, "0")} / {String(ingredients.length).padStart(2, "0")}
          </div>
        </div>
      </div>
      <div>
        {ingredients.map((ing, i) => (
          <Chapter key={ing.name} ing={ing} index={i} onActive={setActive} />
        ))}
      </div>
    </div>
  );
}
