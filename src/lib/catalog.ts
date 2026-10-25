// SAMPLE DATA — placeholder products until the client's real inventory is supplied.
import faceOil from "@/assets/p-face-oil.jpg";
import hairOil from "@/assets/p-hair-oil.jpg";
import ubtan from "@/assets/p-ubtan.jpg";
import ashwa from "@/assets/p-ashwagandha.jpg";
import soap from "@/assets/p-soap.jpg";
import aloe from "@/assets/p-aloe.jpg";
import iAmla from "@/assets/i-amla.jpg";
import iTulsi from "@/assets/i-tulsi.jpg";
import iNeem from "@/assets/i-neem.jpg";
import iAshwa from "@/assets/i-ashwagandha.jpg";
import iTurmeric from "@/assets/i-turmeric.jpg";
import iAloe from "@/assets/i-aloe.jpg";

export type Category = "Skincare" | "Haircare" | "Wellness" | "Bath";
export const categories: Category[] = ["Skincare", "Haircare", "Wellness", "Bath"];

/** Demo 3D form used by the hero, scroll story and 360° viewer. Not real packaging. */
export type ModelSpec = { kind: "dropper" | "bottle" | "jar"; glass: string; cap: string; label: string };

export const categorySlug = (c: Category) => c.toLowerCase();
export const categoryFromSlug = (s: string) => categories.find((c) => categorySlug(c) === s);

export const categoryIntro: Record<Category, string> = {
  Skincare: "Oils, gels and heritage powders for slow morning and evening rituals.",
  Haircare: "Herb-infused oils for an unhurried weekly scalp ritual.",
  Wellness: "Single-ingredient botanicals for the quiet routines of the day.",
  Bath: "Small-batch bars made with garden leaves and plant oils.",
};

export type Product = {
  slug: string;
  name: string;
  category: Category;
  price: number | null;
  sizes: string[];
  image: string;
  tone: "sage" | "linen" | "terracotta";
  short: string;
  description: string;
  ingredients: string[];
  directions: string;
  precautions: string;
  model?: ModelSpec;
};

const patch = "Patch test before first use. For external use only. Discontinue if irritation occurs.";

export const products: Product[] = [
  {
    slug: "kumkumadi-face-oil",
    name: "Saffron & Rose Face Oil",
    category: "Skincare",
    price: 1450,
    sizes: ["15 ml", "30 ml"],
    image: faceOil,
    tone: "sage",
    short: "A lightweight evening oil inspired by classical kumkumadi blends.",
    description:
      "A slow-steeped evening oil carrying saffron and rose in a base of cold-pressed plant oils. Designed as the final, quiet step of a night ritual.",
    ingredients: ["Saffron", "Rose", "Sesame oil", "Almond oil"],
    directions: "Warm 3–4 drops between palms and press gently onto clean skin in the evening.",
    precautions: patch,
    model: { kind: "dropper", glass: "#7a3d12", cap: "#262820", label: "Saffron & Rose Face Oil" },
  },
  {
    slug: "amla-bhringraj-hair-oil",
    name: "Amla & Bhringraj Hair Oil",
    category: "Haircare",
    price: 890,
    sizes: ["100 ml", "200 ml"],
    image: hairOil,
    tone: "terracotta",
    short: "A traditional pre-wash oil for a weekly scalp ritual.",
    description:
      "Herbs infused in coconut and sesame oil using a gentle, slow-heat method. Massage in before washing as part of an unhurried weekly ritual.",
    ingredients: ["Amla", "Bhringraj", "Coconut oil", "Sesame oil"],
    directions: "Massage into scalp and lengths. Leave for at least one hour, then wash.",
    precautions: patch,
    model: { kind: "bottle", glass: "#2c4a30", cap: "#D4AC6C", label: "Amla & Bhringraj Hair Oil" },
  },
  {
    slug: "turmeric-sandal-ubtan",
    name: "Turmeric & Sandal Ubtan",
    category: "Skincare",
    price: 690,
    sizes: ["50 g", "100 g"],
    image: ubtan,
    tone: "linen",
    short: "A heritage powder cleanser mixed fresh at every use.",
    description:
      "A fine powder of turmeric, sandalwood and grains, made to be mixed with water, milk or rose water into a soft paste.",
    ingredients: ["Turmeric", "Sandalwood", "Chickpea flour", "Rose petal"],
    directions: "Mix a spoonful into a paste, apply, let rest for a few minutes, then rinse.",
    precautions: patch + " May temporarily tint light fabrics.",
    model: { kind: "jar", glass: "#e9dcc4", cap: "#BB7958", label: "Turmeric & Sandal Ubtan" },
  },
  {
    slug: "ashwagandha-root-powder",
    name: "Ashwagandha Root Powder",
    category: "Wellness",
    price: 750,
    sizes: ["100 g"],
    image: ashwa,
    tone: "sage",
    short: "Single-origin root powder for your daily routine.",
    description:
      "Sun-dried and stone-ground ashwagandha root, packed without fillers. Traditionally taken stirred into warm milk.",
    ingredients: ["Ashwagandha root"],
    directions: "Follow the label or the guidance of a qualified practitioner.",
    precautions:
      "Consult a qualified healthcare professional before use, especially if pregnant, nursing or taking medication.",
    model: { kind: "jar", glass: "#5b3a1e", cap: "#284537", label: "Ashwagandha Root Powder" },
  },
  {
    slug: "neem-tulsi-soap",
    name: "Neem & Tulsi Bar",
    category: "Bath",
    price: 320,
    sizes: ["100 g"],
    image: soap,
    tone: "terracotta",
    short: "A cold-processed bar with garden-fresh leaves.",
    description:
      "Cold-processed in small batches and cured for weeks. Made with neem and tulsi leaves and a plant-oil base.",
    ingredients: ["Neem", "Tulsi", "Coconut oil", "Castor oil"],
    directions: "Lather with water and rinse. Keep dry between uses.",
    precautions: patch,
  },
  {
    slug: "aloe-rose-gel",
    name: "Aloe & Rose Face Gel",
    category: "Skincare",
    price: 590,
    sizes: ["50 ml"],
    image: aloe,
    tone: "linen",
    short: "A cool, weightless gel for warm days.",
    description:
      "A light gel of aloe vera and rose water. Made for morning layering under sunscreen, or as a cooling mid-day refresh.",
    ingredients: ["Aloe vera", "Rose water", "Glycerin"],
    directions: "Smooth a small amount over clean skin, morning or evening.",
    precautions: patch,
    model: { kind: "jar", glass: "#cfd9c6", cap: "#899779", label: "Aloe & Rose Face Gel" },
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export type Ingredient = {
  name: string;
  sanskrit: string;
  image: string;
  origin: string;
  tradition: string;
  usedIn: string;
};

export const ingredients: Ingredient[] = [
  {
    name: "Amla",
    sanskrit: "Āmalakī",
    image: iAmla,
    origin: "Indian gooseberry",
    tradition: "One of the most widely referenced fruits in classical Ayurvedic texts, traditionally used in hair oils and daily tonics.",
    usedIn: "Infused slowly into our Amla & Bhringraj Hair Oil.",
  },
  {
    name: "Tulsi",
    sanskrit: "Tulasī",
    image: iTulsi,
    origin: "Holy basil",
    tradition: "Grown in courtyards across India for generations and woven into everyday household rituals.",
    usedIn: "Pressed fresh into our Neem & Tulsi Bar.",
  },
  {
    name: "Neem",
    sanskrit: "Nimba",
    image: iNeem,
    origin: "Azadirachta indica",
    tradition: "A familiar village tree whose leaves have long been part of traditional bathing customs.",
    usedIn: "A key herb in our Neem & Tulsi Bar.",
  },
  {
    name: "Ashwagandha",
    sanskrit: "Aśvagandhā",
    image: iAshwa,
    origin: "Withania somnifera",
    tradition: "A root traditionally prepared as a powder and taken with warm milk in classical routines.",
    usedIn: "Offered pure in our Ashwagandha Root Powder.",
  },
  {
    name: "Turmeric",
    sanskrit: "Haridrā",
    image: iTurmeric,
    origin: "Curcuma longa",
    tradition: "Central to the pre-wedding haldi ceremony and to the heritage ubtan, a paste for skin.",
    usedIn: "The golden heart of our Turmeric & Sandal Ubtan.",
  },
  {
    name: "Aloe Vera",
    sanskrit: "Kumārī",
    image: iAloe,
    origin: "Aloe barbadensis",
    tradition: "A cooling succulent long kept on windowsills and applied fresh from the leaf.",
    usedIn: "The base of our Aloe & Rose Face Gel.",
  },
];

export const formatPrice = (p: number | null) =>
  p == null ? "Price on request" : `₹${p.toLocaleString("en-IN")}`;
