import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { lazy, useRef } from "react";
import hero from "@/assets/hero.jpg";
import story from "@/assets/story.jpg";
import ritual from "@/assets/ritual.jpg";
import iTulsi from "@/assets/i-tulsi.jpg";
import { products, type Product } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { MaskImage, Reveal, SplitLines } from "@/components/site/Reveal";
import { LeafSprig, Mandala } from "@/components/site/Botanical";
import { IngredientHover } from "@/components/site/IngredientHover";
import { ScrollStory } from "@/components/site/ScrollStory";
import { Lazy3D } from "@/components/site/Lazy3D";
import { Magnetic } from "@/components/site/Magnetic";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ananta — Ancient Wisdom. Naturally Beautiful." },
      { name: "description", content: "Discover Ayurvedic skincare, haircare and wellness made with amla, tulsi, neem, turmeric and more." },
      { property: "og:title", content: "Ananta — Ancient Wisdom. Naturally Beautiful." },
      { property: "og:description", content: "Ayurvedic rituals crafted from India's botanical heritage." },
    ],
  }),
  component: Home,
});

function Hero() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const imgX = useTransform(sx, (v) => v * -14);
  const imgY = useTransform(sy, (v) => v * -10);
  const leafX = useTransform(sx, (v) => v * 30);
  const leafY = useTransform(sy, (v) => v * 24);

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden pt-20"
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <Mandala className="pointer-events-none absolute -left-40 top-24 h-[560px] w-[560px] text-gold/30 animate-drift-slow" />
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-12 gap-6 px-6 pb-20 pt-10 md:px-12 lg:pt-16">
        <div className="relative z-10 col-span-12 lg:col-span-6 lg:pt-16">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className="eyebrow">
            Ayurvedic botanicals · Est. in India
          </motion.p>
          <h1 className="mt-6 font-display text-[clamp(3.2rem,8vw,7.5rem)] leading-[0.92] text-primary">
            <SplitLines lines={["Ancient", "Wisdom."]} delay={0.3} />
            <SplitLines lines={["Naturally", "Beautiful."]} delay={0.6} className="italic text-accent" />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground"
          >
            Discover the timeless essence of Ayurveda, thoughtfully crafted for modern living.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <Magnetic>
              <Link to="/shop" className="btn-lux group">
                Explore Collection <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.3} />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/story" className="btn-ghost-lux link-underline">Discover Our Story</Link>
            </Magnetic>
          </motion.div>
        </div>

        <div className="relative col-span-12 mt-8 h-[60vh] lg:col-span-6 lg:mt-0 lg:h-[78vh]">
          <motion.div
            style={{ x: imgX, y: imgY }}
            initial={{ opacity: 0, clipPath: "inset(20% 20% 20% 20% round 999px 999px 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)" }}
            transition={{ duration: 1.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 w-[88%] overflow-hidden rounded-t-[999px] bg-[radial-gradient(ellipse_at_50%_45%,var(--ivory)_0%,var(--linen)_45%,color-mix(in_oklab,var(--sage)_45%,var(--linen))_100%)] shadow-soft"
          >
            <img src={hero} alt="" aria-hidden width={1600} height={1104} className="absolute inset-0 h-full w-full object-cover object-[62%_center] opacity-20 mix-blend-multiply" />
            <Lazy3D
              className="absolute inset-0"
              rootMargin="0px"
              fallback={<img src={hero} alt="Ayurvedic oils and balm among tulsi, turmeric and marigold" width={1600} height={1104} className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />}
              render={(active) => (
                <div className="absolute inset-0 cursor-grab" data-cursor="Move to explore">
                  <HeroScene active={active && !reduce} />
                </div>
              )}
            />
          </motion.div>
          <motion.div
            style={{ x: leafX, y: leafY }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1 }}
            className="absolute -left-2 bottom-10 w-[38%] max-w-[220px] overflow-hidden rounded-full border-[6px] border-background shadow-soft"
          >
            <img src={iTulsi} alt="" className="aspect-square w-full object-cover" />
          </motion.div>
          <motion.div style={{ x: leafX, y: imgY }} className="absolute -top-6 left-[6%] text-primary/50">
            <LeafSprig className="h-48 w-28 animate-drift" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="absolute bottom-4 right-4 max-w-[180px] rounded-sm bg-background/90 px-4 py-3 text-[0.65rem] uppercase leading-relaxed tracking-[0.2em]"
          >
            Fig. 01 — Demo bottle with neem, tulsi & turmeric. Placeholder until real packaging arrives.
          </motion.p>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
        <span className="relative h-10 w-px bg-border">
          <span className="absolute -left-[2px] top-0 h-[5px] w-[5px] rounded-full bg-accent animate-scroll-dot" />
        </span>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["Amla", "Tulsi", "Neem", "Ashwagandha", "Haridra", "Kumari", "Bhringraj", "Chandan"];
  return (
    <div className="overflow-hidden border-y border-border py-6" aria-hidden>
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap font-display text-4xl italic text-primary/70">
        {[...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center gap-12">
            {w} <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Collection() {
  const [a, b, c, d] = products as [Product, Product, Product, Product, ...Product[]];
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-28 md:px-12 md:py-40">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <Reveal>
          <p className="eyebrow">The Collection</p>
          <h2 className="mt-4 max-w-2xl font-display text-5xl leading-[1] md:text-7xl">
            Objects of <em className="text-accent">daily devotion.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <Link to="/shop" className="btn-ghost-lux link-underline">View all products →</Link>
        </Reveal>
      </div>
      <div className="mt-20 grid gap-x-8 gap-y-16 md:grid-cols-12">
        <Reveal className="md:col-span-5"><ProductCard product={a} tall /></Reveal>
        <Reveal className="md:col-span-4 md:col-start-7 md:mt-40" delay={0.1}><ProductCard product={b} /></Reveal>
        <Reveal className="md:col-span-4 md:col-start-2 md:-mt-10" delay={0.1}><ProductCard product={c} /></Reveal>
        <Reveal className="md:col-span-5 md:col-start-7 md:-mt-24" delay={0.2}><ProductCard product={d} tall /></Reveal>
      </div>
    </section>
  );
}

function Philosophy() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const fg = useTransform(scrollYProgress, [0, 1], ["40%", "-40%"]);
  const bg = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  return (
    <section ref={ref} className="relative overflow-hidden bg-forest py-28 text-forest-foreground md:py-40">
      <motion.div style={{ y: bg }} className="pointer-events-none absolute -right-40 bottom-0">
        <Mandala className="h-[600px] w-[600px] text-gold/15" />
      </motion.div>
      <motion.div style={{ y: fg }} className="pointer-events-none absolute left-[38%] top-1/3 z-10 hidden text-gold/40 md:block">
        <LeafSprig className="h-72 w-40 rotate-12" />
      </motion.div>
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-16 px-6 md:grid-cols-12 md:px-12">
        <div className="relative md:col-span-5">
          <div className="aspect-[4/5] overflow-hidden rounded-b-[999px]">
            <motion.img style={{ y }} src={story} alt="Hands grinding herbs in a stone mortar" loading="lazy" className="h-[116%] w-full object-cover" />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <Reveal>
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">Our Story</p>
            <h2 className="mt-6 font-display text-5xl leading-[1.02] md:text-7xl">
              Where Ancient Wisdom <em className="text-gold">Meets Modern Wellness.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-10 max-w-lg text-lg leading-relaxed opacity-80">
              Ayurveda begins with attention — to the seasons, to the body, to the plant itself. We bring that same attention to every batch: whole herbs, patient methods and a deep respect for the knowledge passed through Indian households.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-x-8 gap-y-10 border-t border-forest-foreground/15 pt-10 sm:grid-cols-2">
            {[
              ["Philosophy", "Attention to season, body and plant."],
              ["Sourcing", "Where our herbs come from — to be added."],
              ["How we make", "Our small-batch methods — to be added."],
              ["Quality", "Verified testing and practices — to be added."],
              ["Inspiration", "Classical Ayurvedic household rituals."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={0.15 + i * 0.08}>
                <p className="text-[0.65rem] uppercase tracking-[0.25em] text-gold">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-2 font-display text-3xl">{t}</p>
                <p className="mt-1 text-sm opacity-60">{d}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.5}>
            <Magnetic className="mt-12">
              <Link to="/story" className="btn-ghost-lux link-underline text-forest-foreground">Read our story →</Link>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Ritual() {
  const P = products as Product[] & Record<0 | 1 | 2 | 5, Product>;
  const steps = [
    { n: "01", t: "Cleanse", d: "Mix ubtan into a soft paste and rinse away the day.", p: P[2] },
    { n: "02", t: "Refresh", d: "Layer a cool veil of aloe and rose gel.", p: P[5] },
    { n: "03", t: "Nourish", d: "Press saffron and rose oil into skin before sleep.", p: P[0] },
    { n: "04", t: "Restore", d: "Once a week, oil the scalp and rest unhurried.", p: P[1] },
  ];
  return (
    <section className="py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <MaskImage src={ritual} alt="Brass bowl, face oil, linen and tulsi arranged for a ritual" className="aspect-[16/7] rounded-sm" from="left" />
        <div className="mt-16 grid gap-6 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <p className="eyebrow">Daily Wellness Ritual</p>
            <h2 className="mt-4 font-display text-5xl leading-[1] md:text-6xl">A ritual in <em className="text-accent">four breaths.</em></h2>
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-sm bg-border md:col-span-8 sm:grid-cols-2">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08} className="h-full">
                <Link to="/shop/$slug" params={{ slug: s.p.slug }} className="group flex h-full flex-col bg-background p-8 transition-colors duration-700 hover:bg-linen">
                  <span className="font-display text-6xl text-gold">{s.n}</span>
                  <span className="mt-6 font-display text-3xl">{s.t}</span>
                  <span className="mt-2 text-sm text-muted-foreground">{s.d}</span>
                  <span className="mt-6 text-[0.68rem] uppercase tracking-[0.22em] text-accent">{s.p.name} →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    ["Are these products suitable for everyone?", "Every skin and body is different. We recommend a patch test before first use and consulting a qualified practitioner for wellness products."],
    ["How should I store the oils?", "Keep them in a cool, dark place, tightly closed, away from direct sunlight."],
    ["Do you ship across India?", "Shipping details will be confirmed when ordering opens. For now, please send an enquiry."],
  ];
  return (
    <section className="mx-auto grid max-w-[1440px] gap-12 px-6 pb-32 md:grid-cols-12 md:px-12">
      <Reveal className="md:col-span-4">
        <p className="eyebrow">Questions</p>
        <h2 className="mt-4 font-display text-5xl">Gently answered.</h2>
        <Link to="/contact" className="btn-lux mt-8">Ask us anything</Link>
      </Reveal>
      <div className="md:col-span-7 md:col-start-6">
        {items.map(([q, a]) => (
          <details key={q} className="group border-b border-border py-6">
            <summary className="flex cursor-pointer list-none items-center justify-between font-display text-2xl">
              {q}
              <span className="ml-6 text-accent transition-transform duration-500 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 max-w-xl text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Collection />
      <ScrollStory />
      <IngredientHover />
      <Philosophy />
      <Ritual />
      <Faq />
    </>
  );
}
