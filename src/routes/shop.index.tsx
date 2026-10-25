import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { categories, products, type Category } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal, SplitLines } from "@/components/site/Reveal";

type Search = { category?: Category };

export const Route = createFileRoute("/shop/")({
  validateSearch: (s: Record<string, unknown>): Search => 
    categories.includes(s["category"] as Category) ? { category: s["category"] as Category } : {},
  head: () => ({
    meta: [
      { title: "Shop the Collection — Ananta Ayurveda" },
      { name: "description", content: "Browse Ayurvedic skincare, haircare, bath and wellness rituals." },
      { property: "og:title", content: "Shop the Collection — Ananta Ayurveda" },
      { property: "og:description", content: "Ayurvedic skincare, haircare, bath and wellness rituals." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();
  const list = category ? products.filter((p) => p.category === category) : products;
  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-32 pt-36 md:px-12">
      <p className="eyebrow">Sample catalogue · final range coming soon</p>
      <h1 className="mt-4 font-display text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-primary">
        <SplitLines lines={[category ?? "The Collection"]} />
      </h1>
      <div className="mt-12 flex flex-wrap gap-3">
        {[undefined, ...categories].map((c) => {
          const active = c === category;
          return (
            <Link
              key={c ?? "all"}
              to="/shop"
              search={c ? { category: c } : {}}
              className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] transition-colors duration-500 ${
                active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
              }`}
            >
              {c ?? "All"}
            </Link>
          );
        })}
      </div>
      <motion.div layout className="mt-16 grid gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              className={i % 3 === 1 ? "lg:mt-24" : ""}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <Reveal className="mt-32 text-center">
        <p className="mx-auto max-w-lg text-sm text-muted-foreground">
          Ordering is not yet open. Use “Enquire” on any product and we will respond personally.
        </p>
      </Reveal>
    </div>
  );
}
