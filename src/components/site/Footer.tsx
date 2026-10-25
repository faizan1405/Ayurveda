import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { LotusMark, Mandala } from "./Botanical";

type Route = "/shop" | "/story" | "/ingredients" | "/contact";

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="relative overflow-hidden bg-forest text-forest-foreground">
      <Mandala className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] text-gold/20 animate-drift-slow" />
      <div className="relative mx-auto max-w-[1440px] px-6 pb-10 pt-24 md:px-12">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="font-display text-5xl leading-[1.05] md:text-6xl">
              Letters from <em className="text-gold">the garden.</em>
            </h2>
            <p className="mt-4 max-w-sm text-sm opacity-70">Seasonal rituals and new arrivals. A few times a year, never more.</p>
            <form
              className="mt-8 flex max-w-md border-b border-forest-foreground/30"
              onSubmit={(e) => {
                e.preventDefault();
                toast("Thank you", { description: "Newsletter signup is a preview — no email was stored." });
                setEmail("");
              }}
            >
              <label htmlFor="nl" className="sr-only">Email</label>
              <input
                id="nl"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 bg-transparent py-4 text-sm placeholder:text-forest-foreground/40 focus:outline-none"
              />
              <button className="text-xs uppercase tracking-[0.25em] text-gold">Subscribe</button>
            </form>
          </div>
          {([
            { h: "Shop", l: [["/shop", "All products"], ["/shop", "Skincare"], ["/shop", "Haircare"], ["/shop", "Wellness"]] },
            { h: "Brand", l: [["/story", "Our Story"], ["/ingredients", "Ingredients"], ["/contact", "FAQ"]] },
            { h: "Visit", l: [["/contact", "Contact"], ["/contact", "Enquiries"]] },
          ] as { h: string; l: [Route, string][] }[]).map((c) => (
            <div key={c.h} className="md:col-span-2">
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">{c.h}</p>
              <ul className="mt-6 space-y-3 text-sm opacity-80">
                {c.l.map(([to, label]) => (
                  <li key={c.h + label}>
                    <Link to={to} className="link-underline">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-24 flex flex-col items-start justify-between gap-6 border-t border-forest-foreground/15 pt-8 text-xs opacity-60 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <LotusMark className="h-5 w-7" />
            <span className="tracking-[0.2em]">ANANTA — temporary brand identity</span>
          </div>
          <p>Sample catalogue shown. Products are not intended to diagnose, treat or cure any condition.</p>
        </div>
      </div>
    </footer>
  );
}
