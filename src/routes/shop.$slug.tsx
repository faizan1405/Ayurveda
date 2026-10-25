import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { lazy, useState } from "react";
import { ArrowLeft, Box, Minus, Plus } from "lucide-react";
import { formatPrice, getProduct, ingredients, products } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { Lazy3D } from "@/components/site/Lazy3D";

const ProductViewer = lazy(() => import("@/components/three/ProductViewer"));

function ViewerLoading() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-linen">
      <span className="h-10 w-10 animate-spin rounded-full border border-primary/20 border-t-accent" />
      <span className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">Preparing 3D view</span>
    </div>
  );
}

function ViewerUnsupported({ onExit }: { onExit: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-linen p-8 text-center">
      <p className="font-display text-2xl">3D view isn't available on this device.</p>
      <button type="button" onClick={onExit} className="btn-lux">Back to photos</button>
    </div>
  );
}

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Ananta Ayurveda` },
          { name: "description", content: loaderData.product.short },
          { property: "og:title", content: `${loaderData.product.name} — Ananta Ayurveda` },
          { property: "og:description", content: loaderData.product.short },
        ]
      : [{ title: "Product not found — Ananta" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 pt-20 text-center">
      <h1 className="font-display text-5xl">This product has wandered off.</h1>
      <Link to="/shop" className="btn-lux">Back to the collection</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const gallery = [
    product.image,
    ...ingredients.filter((i) => product.ingredients.some((n) => i.name.startsWith(n.split(" ")[0] ?? n))).map((i) => i.image),
  ];
  const [idx, setIdx] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [view3d, setView3d] = useState(false);
  const [tab, setTab] = useState<"About" | "Directions" | "Precautions">("About");
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div className="pt-28">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 md:px-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Link to="/shop" className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.3} /> Collection
          </Link>
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] bg-linen md:aspect-[5/5.5]">
            {view3d && product.model ? (
              <Lazy3D
                className="absolute inset-0"
                rootMargin="0px"
                fallback={<ViewerLoading />}
                unsupported={<ViewerUnsupported onExit={() => setView3d(false)} />}
                render={(active) => <ProductViewer spec={product.model!} active={active} onExit={() => setView3d(false)} />}
              />
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={idx}
                  src={gallery[idx]}
                  alt={`${product.name} image ${idx + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              </AnimatePresence>
            )}
          </div>
          {(gallery.length > 1 || product.model) && (
            <div className="mt-4 flex flex-wrap items-center gap-3" role="tablist" aria-label="Product images">
              {gallery.map((g, i) => (
                <button
                  key={g}
                  role="tab"
                  aria-selected={!view3d && i === idx}
                  aria-label={`Show image ${i + 1}`}
                  onClick={() => {
                    setIdx(i);
                    setView3d(false);
                  }}
                  className={`h-20 w-16 overflow-hidden rounded-t-full border-2 transition-all duration-500 ${
                    !view3d && i === idx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
              {product.model && (
                <button
                  role="tab"
                  aria-selected={view3d}
                  onClick={() => setView3d(true)}
                  className={`ml-auto inline-flex items-center gap-2 rounded-full border px-5 py-3 text-[0.65rem] uppercase tracking-[0.22em] transition-colors duration-500 ${
                    view3d ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                  }`}
                >
                  <Box className="h-4 w-4" strokeWidth={1.3} /> View in 3D
                </button>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 lg:pt-16">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">{product.category} · Sample product</p>
            <h1 className="mt-4 font-display text-5xl leading-[1] md:text-6xl">{product.name}</h1>
            <p className="mt-4 font-display text-2xl text-accent">{formatPrice(product.price)}</p>
            <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-8">
              <p className="eyebrow mb-3">Size</p>
              <div className="flex gap-3">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                      s === size ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <button aria-label="Decrease quantity" className="p-3" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></button>
                <span className="w-8 text-center text-sm">{qty}</span>
                <button aria-label="Increase quantity" className="p-3" onClick={() => setQty((q) => q + 1)}><Plus className="h-4 w-4" /></button>
              </div>
              <Link to="/contact" search={{ product: `${product.name} (${size}) × ${qty}` }} className="btn-lux flex-1 justify-center">
                Enquire to order
              </Link>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Online ordering isn't open yet — this sends an enquiry.</p>

            <div className="mt-10 border-t border-border pt-6">
              <p className="eyebrow mb-3">Key ingredients</p>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((i) => (
                  <span key={i} className="rounded-full bg-secondary px-4 py-1.5 text-sm">{i}</span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex gap-6 border-b border-border">
                {(["About", "Directions", "Precautions"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`relative pb-3 text-xs uppercase tracking-[0.2em] ${tab === t ? "text-foreground" : "text-muted-foreground"}`}>
                    {t}
                    {tab === t && <motion.span layoutId="tab" className="absolute inset-x-0 -bottom-px h-px bg-primary" />}
                  </button>
                ))}
              </div>
              <p className="pt-5 text-sm leading-relaxed text-muted-foreground">
                {tab === "About" ? product.short : tab === "Directions" ? product.directions : product.precautions}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1440px] px-6 py-32 md:px-12">
        <Reveal>
          <h2 className="font-display text-5xl">Complete the <em className="text-accent">ritual.</em></h2>
        </Reveal>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1}><ProductCard product={p} /></Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
