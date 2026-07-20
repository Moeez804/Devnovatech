/** Visually hidden until focused — lets keyboard users bypass the navbar and jump straight to main content. */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent-violet focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
    >
      Skip to main content
    </a>
  );
}