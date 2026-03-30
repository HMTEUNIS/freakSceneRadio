export function SiteBackground() {
  return (
    <div className="site-background" aria-hidden>
      {/* Rasterized at 1/4 size then scaled up for chunky pixels */}
      <img
        src="/radiotelep.jpeg"
        alt=""
        className="site-background-img"
        fetchPriority="low"
        decoding="async"
      />
      <div className="site-background-veil" />
    </div>
  );
}
