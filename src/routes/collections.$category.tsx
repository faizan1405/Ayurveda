import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { categories, categoryFromSlug, categoryIntro, categorySlug, products } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal, SplitLines } from "@/components/site/Reveal";
import { Mandala } from "@/components/site/Botanical";

export const Route = createFileRoute("/collections/$category")({
  loader: ({ params }) => {
    const category = categoryFromSlug(params.category);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.category} Collection — Ananta Ayurveda` },
          { name: "description", content: categoryIntro[loaderData.category] },
          { property: "og:title", content: `${loaderData.category} Collection — Ananta Ayurveda` },
          { property: "og:description", content: categoryIntro[loaderData.category] },
        ]
      : [{ title: "Collection not found — Ananta" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 pt-20 text-center">
      <h1 className="font-display text-5xl">This collection doesn't exist.</h1>
      <Link to="/shop" className="btn-lux">See all products</Link>
    </div>
  ),
  component: Collection,
});

function Collection() {
  const { category } = Route.useLoaderData();
  const list = products.filter((p) => p.category === category);
  return (
    <div className="relative overflow-hidden pb-32 pt-36">
      <Mandala className="pointer-events-none absolute -right-48 top-10 h-[620px] w-[620px] text-gold/25 animate-drift-slow" />
      <div className="relative mx-auto max-w-[1440px] px-6 md:px-12">
        <p className="eyebrow">Collection · sample range</p>
        <h1 className="mt-4 font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.9] text-primary">
          <SplitLines lines={[category]} />
        </h1>
        <Reveal delay={0.3}>
          <p className="mt-8 max-w-md text-lg text-muted-foreground">{categoryIntro[category]}</p>
        </Reveal>

        <div className="mt-20 grid gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08} className={i % 3 === 1 ? "lg:mt-24" : ""}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>

        <div className="mt-32 border-t border-border pt-10">
          <p className="eyebrow">Other collections</p>
          <div className="mt-6 flex flex-wrap gap-x-12 gap-y-4">
            {categories
              .filter((c) => c !== category)
              .map((c) => (
                <Link key={c} to="/collections/$category" params={{ category: categorySlug(c) }} className="link-underline font-display text-4xl transition-colors hover:text-accent">
                  {c}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
