import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LotusMark } from "./Botanical";
import { categories, categorySlug } from "@/lib/catalog";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/story", label: "Our Story" },
  { to: "/ingredients", label: "Ingredients" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    setOpen(false);
    setMega(false);
  }, [path]);

  const solid = scrolled || path !== "/";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        solid ? "border-b border-border/60 bg-background/90 backdrop-blur-md" : "bg-transparent"
      }`}
      onMouseLeave={() => setMega(false)}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-12">
        <Link to="/" className="flex items-center gap-3 text-primary" aria-label="Ananta home">
          <LotusMark className="h-6 w-8" />
          <span className="font-display text-2xl tracking-[0.2em]">ANANTA</span>
        </Link>

        <nav className="hidden items-center gap-10 lg:flex" aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              onMouseEnter={() => setMega(n.to === "/shop")}
              onFocus={() => setMega(n.to === "/shop")}
              className="link-underline text-xs uppercase tracking-[0.22em] text-foreground/80 transition-colors hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-foreground/80">
          <Link to="/shop" aria-label="Search products" className="hidden transition-colors hover:text-accent sm:block">
            <Search className="h-[18px] w-[18px]" strokeWidth={1.3} />
          </Link>
          <Link to="/contact" aria-label="Enquiry bag" className="transition-colors hover:text-accent">
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.3} />
          </Link>
          <button className="lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="h-6 w-6" strokeWidth={1.2} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mega && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-20 hidden border-b border-border bg-background lg:block"
          >
            <div className="mx-auto grid max-w-[1440px] grid-cols-5 gap-10 px-12 py-10">
              <div>
                <p className="eyebrow">Collections</p>
                <p className="mt-3 font-display text-3xl leading-tight">Rituals for every day.</p>
              </div>
              {categories.map((c) => (
                <Link
                  key={c}
                  to="/collections/$category"
                  params={{ category: categorySlug(c) }}
                  className="group border-l border-border pl-6"
                >
                  <span className="font-display text-2xl transition-colors group-hover:text-accent">{c}</span>
                  <span className="mt-2 block text-xs text-muted-foreground">Explore →</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-forest text-forest-foreground lg:hidden"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-20 items-center justify-between px-6">
              <span className="font-display text-2xl tracking-[0.2em]">ANANTA</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)}>
                <X className="h-6 w-6" strokeWidth={1.2} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-4 px-8" aria-label="Mobile">
              {nav.map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.6 }}
                >
                  <Link to={n.to} className="font-display text-5xl">
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <p className="px-8 pb-10 text-xs uppercase tracking-[0.25em] opacity-60">Rooted in nature</p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
