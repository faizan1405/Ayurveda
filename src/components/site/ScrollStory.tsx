import { lazy, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { getProduct, ingredients, type ModelSpec } from "@/lib/catalog";
import { hasWebGL } from "@/lib/webgl";
import { Lazy3D } from "./Lazy3D";
import { Reveal } from "./Reveal";

const StoryScene = lazy(() => import("@/components/three/StoryScene"));

const product = getProduct("amla-bhringraj-hair-oil")!;
const spec = product.model as ModelSpec;
const amla = ingredients.find((i) => i.name === "Amla")!;

const captions = [
  { eyebrow: "01 — The vessel", title: "Poured, sealed, kept from light.", body: "A deep green glass bottle with a gold cap — shown here as a demo form." },
  { eyebrow: "02 — Turn", title: "Every side tells the ritual.", body: "Scroll to turn the bottle and see it from another angle." },
  { eyebrow: "03 — Closer", title: "Read the label up close.", body: "Final label artwork will replace this demo label." },
  { eyebrow: "04 — Botanicals", title: "What goes inside.", body: "Amla, bhringraj leaf, coconut and sesame — the herbs and oils in this blend." },
];

function Simple() {
  return (
    <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-6 py-24 md:grid-cols-2 md:px-12">
      <Reveal>
        <div className="aspect-[4/5] overflow-hidden rounded-t-[999px] bg-linen">
          <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="eyebrow">In focus · sample product</p>
        <h2 className="mt-4 font-display text-5xl leading-[1]">{product.name}</h2>
        <p className="mt-6 text-muted-foreground">{product.description}</p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {product.ingredients.map((i) => (
            <li key={i} className="rounded-full bg-secondary px-4 py-1.5 text-sm">{i}</li>
          ))}
        </ul>
        <Link to="/shop/$slug" params={{ slug: product.slug }} className="btn-lux mt-10">View product</Link>
      </Reveal>
    </section>
  );
}

export function ScrollStory() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef({ p: 0 });
  const [mode, setMode] = useState<"pending" | "full" | "simple">("pending");

  useEffect(() => {
    const simple = window.matchMedia("(max-width: 767px), (prefers-reduced-motion: reduce)").matches || !hasWebGL();
    setMode(simple ? "simple" : "full");
  }, []);

  useEffect(() => {
    if (mode !== "full" || !ref.current) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom bottom", scrub: 1 },
        });
        tl.to(progress.current, { p: 1, duration: 1 }, 0);
        tl.fromTo("[data-bar]", { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0);
        const windows: [number, number][] = [[0, 0.14], [0.17, 0.33], [0.36, 0.5], [0.5, 0.62]];
        windows.forEach(([a, b], i) => {
          const el = `[data-cap="${i}"]`;
          if (i > 0) tl.fromTo(el, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.04 }, a);
          tl.to(el, { autoAlpha: 0, y: -40, duration: 0.04 }, b);
        });
        tl.fromTo("[data-info]", { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.06 }, 0.66);
        tl.to("[data-info]", { autoAlpha: 0, y: -40, duration: 0.05 }, 0.86);
        tl.fromTo("[data-next]", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.9);
      }, ref);
      revert = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      revert?.();
    };
  }, [mode]);

  if (mode === "simple") return <Simple />;

  return (
    <section ref={ref} className="relative h-[520vh] bg-linen" aria-label={`${product.name} in focus`}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,var(--ivory)_0%,transparent_60%)]" />
        <Lazy3D
          className="absolute inset-0"
          rootMargin="600px"
          fallback={<div className="absolute inset-0" />}
          render={(active) => <StoryScene active={active} progress={progress} spec={spec} />}
        />

        <div className="absolute left-6 top-28 md:left-12">
          <p className="eyebrow">In focus · sample product</p>
          <p className="mt-2 font-display text-3xl">{product.name}</p>
        </div>
        <div className="absolute right-6 top-28 hidden h-40 w-px bg-border md:right-12 md:block">
          <span data-bar className="absolute inset-0 origin-top bg-accent" />
        </div>

        {captions.map((c, i) => (
          <div key={c.eyebrow} data-cap={i} className="absolute bottom-16 left-6 max-w-sm md:left-12" style={i ? { opacity: 0, visibility: "hidden" } : undefined}>
            <p className="eyebrow">{c.eyebrow}</p>
            <h3 className="mt-3 font-display text-4xl leading-[1.05] md:text-5xl">{c.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
          </div>
        ))}

        <aside data-info className="absolute right-6 top-1/2 w-[min(380px,40vw)] -translate-y-1/2 rounded-sm border border-border bg-background/90 p-8 backdrop-blur md:right-16" style={{ opacity: 0, visibility: "hidden" }}>
          <p className="eyebrow">05 — Inside the blend</p>
          <ul className="mt-6 divide-y divide-border">
            {product.ingredients.map((i) => (
              <li key={i} className="flex items-baseline justify-between py-3">
                <span className="font-display text-2xl">{i}</span>
                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">{i === "Amla" ? amla.sanskrit : i.includes("oil") ? "Base oil" : "Herb"}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{amla.tradition}</p>
        </aside>

        <div data-next className="absolute right-6 top-1/2 max-w-xs -translate-y-1/2 text-right md:right-16" style={{ opacity: 0, visibility: "hidden" }}>
          <p className="eyebrow">06 — Continue</p>
          <p className="mt-3 font-display text-4xl leading-[1.05]">Make it part of your week.</p>
          <Link to="/shop/$slug" params={{ slug: product.slug }} className="btn-lux mt-6">Discover this oil</Link>
        </div>
      </div>
    </section>
  );
}
