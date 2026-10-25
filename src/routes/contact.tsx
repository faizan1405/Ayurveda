import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { Reveal, SplitLines } from "@/components/site/Reveal";

export const Route = createFileRoute("/contact")({
  validateSearch: (s: Record<string, unknown>): { product?: string } =>
    typeof s["product"] === "string" ? { product: s["product"] } : {},
  head: () => ({
    meta: [
      { title: "Contact & Enquiries — Ananta Ayurveda" },
      { name: "description", content: "Send an enquiry about our Ayurvedic products." },
      { property: "og:title", content: "Contact & Enquiries — Ananta Ayurveda" },
      { property: "og:description", content: "Send an enquiry about our Ayurvedic products." },
    ],
  }),
  component: Contact,
});

function Field({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input {...p} className="mt-2 w-full border-b border-border bg-transparent py-3 focus:border-primary focus:outline-none" />
    </label>
  );
}

function Contact() {
  const { product } = Route.useSearch();
  const [msg, setMsg] = useState(product ? `I'd like to order: ${product}` : "");
  return (
    <div className="mx-auto grid max-w-[1440px] gap-16 px-6 pb-32 pt-36 md:grid-cols-12 md:px-12">
      <div className="md:col-span-5">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] text-primary">
          <SplitLines lines={["Write to", "the garden."]} />
        </h1>
        <Reveal delay={0.3}>
          <ul className="mt-12 space-y-5 text-sm">
            <li className="flex gap-4"><Mail className="h-5 w-5 text-accent" strokeWidth={1.2} /> hello@example.com</li>
            <li className="flex gap-4"><Phone className="h-5 w-5 text-accent" strokeWidth={1.2} /> +91 00000 00000</li>
            <li className="flex gap-4"><MapPin className="h-5 w-5 text-accent" strokeWidth={1.2} /> Studio address to be confirmed</li>
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">Placeholder contact details — real ones coming soon.</p>
        </Reveal>
      </div>
      <Reveal className="md:col-span-6 md:col-start-7" delay={0.2}>
        <form
          className="space-y-8 rounded-sm bg-card p-8 shadow-soft md:p-12"
          onSubmit={(e) => {
            e.preventDefault();
            toast("Enquiry received (preview)", { description: "This form is a design preview — no message was sent yet." });
            (e.target as HTMLFormElement).reset();
            setMsg("");
          }}
        >
          <div className="grid gap-8 sm:grid-cols-2">
            <Field label="Name" name="name" required />
            <Field label="Email" name="email" type="email" required />
          </div>
          <Field label="Phone (optional)" name="phone" type="tel" />
          <label className="block">
            <span className="eyebrow">Message</span>
            <textarea
              rows={5}
              required
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="mt-2 w-full resize-none border-b border-border bg-transparent py-3 focus:border-primary focus:outline-none"
            />
          </label>
          <button className="btn-lux">Send enquiry</button>
        </form>
      </Reveal>
    </div>
  );
}
