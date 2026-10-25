import { createFileRoute, Link } from "@tanstack/react-router";
import story from "@/assets/story.jpg";
import hero from "@/assets/hero.jpg";
import { MaskImage, Reveal, SplitLines } from "@/components/site/Reveal";
import { Mandala } from "@/components/site/Botanical";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Ananta Ayurveda" },
      { name: "description", content: "The philosophy behind Ananta: nature, traditional knowledge and quality ingredients for modern life." },
      { property: "og:title", content: "Our Story — Ananta Ayurveda" },
      { property: "og:description", content: "Nature, traditional knowledge and quality ingredients for modern life." },
    ],
  }),
  component: Story,
});

function Story() {
  return (
    <div className="pt-36">
      <section className="relative mx-auto max-w-[1440px] px-6 md:px-12">
        <Mandala className="pointer-events-none absolute right-0 top-0 h-96 w-96 text-gold/25 animate-drift-slow" />
        <p className="eyebrow">Our Story</p>
        <h1 className="mt-6 max-w-5xl font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.95] text-primary">
          <SplitLines lines={["A slower way", "of caring."]} />
        </h1>
      </section>
      <section className="mx-auto mt-20 grid max-w-[1440px] gap-12 px-6 md:grid-cols-12 md:px-12">
        <MaskImage src={story} alt="Herbs being ground by hand" className="aspect-[4/5] rounded-t-[999px] md:col-span-6" />
        <div className="flex flex-col justify-end md:col-span-5 md:col-start-8">
          <Reveal>
            <p className="font-display text-3xl leading-snug">
              “We believe the most meaningful care is unhurried — made with whole plants, honest methods and attention.”
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 leading-relaxed text-muted-foreground">
              Ananta is a temporary name for this preview. The brand's founding story, sourcing partners and production details will be added here once verified by the business.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-6 py-32 md:px-12">
        <div className="grid gap-px overflow-hidden rounded-sm bg-border md:grid-cols-3">
          {[
            ["Sourcing", "Where our herbs are grown and how they're chosen."],
            ["Production", "Small-batch methods, from infusion to curing."],
            ["Testing", "Quality checks performed on every batch."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.1} className="h-full">
              <div className="h-full bg-background p-10">
                <span className="font-display text-5xl text-gold">0{i + 1}</span>
                <h2 className="mt-6 font-display text-4xl">{t}</h2>
                <p className="mt-3 text-muted-foreground">{d}</p>
                <p className="mt-6 text-xs uppercase tracking-[0.2em] text-accent">Verified details pending</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-6 pb-32 md:px-12">
        <MaskImage src={hero} alt="Ayurvedic products among botanicals" className="aspect-[16/8] rounded-sm" from="right" />
        <Reveal className="mt-12 text-center">
          <Link to="/shop" className="btn-lux">Explore the collection</Link>
        </Reveal>
      </section>
    </div>
  );
}
