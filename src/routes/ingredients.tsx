import { createFileRoute } from "@tanstack/react-router";
import { IngredientStory } from "@/components/site/IngredientStory";
import { SplitLines } from "@/components/site/Reveal";

export const Route = createFileRoute("/ingredients")({
  head: () => ({
    meta: [
      { title: "Ingredients — Ananta Ayurveda" },
      { name: "description", content: "Amla, tulsi, neem, ashwagandha, turmeric and aloe vera — the plants behind our rituals." },
      { property: "og:title", content: "Ingredients — Ananta Ayurveda" },
      { property: "og:description", content: "The botanical heritage behind every Ananta product." },
    ],
  }),
  component: () => (
    <div className="pt-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <p className="eyebrow">Nature's Finest Ingredients</p>
        <h1 className="mt-6 font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.95] text-primary">
          <SplitLines lines={["The garden", "behind the jar."]} />
        </h1>
        <p className="mt-8 max-w-lg text-muted-foreground">
          Traditional context for the plants we work with. We share heritage, not medical claims.
        </p>
      </div>
      <IngredientStory />
    </div>
  ),
});
