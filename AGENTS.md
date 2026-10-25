<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- 3D scenes live in `src/components/three/*` (default-exported Canvas components) and are only loaded via `React.lazy` inside `Lazy3D`, so three.js never runs during SSR and loops pause offscreen.
- Product 3D forms are procedural demo packaging driven by `Product.model` in `src/lib/catalog.ts`; swap to real GLB files when the brand supplies them.
- Scroll-linked 3D uses one GSAP ScrollTrigger timeline writing a progress ref read in `useFrame`; Motion handles all other UI animation — never animate the same property with both.
- Frontend only: no backend, auth, payments or databases until the client's external backend is chosen.
