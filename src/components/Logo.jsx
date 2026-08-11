// Landscape wordmark used in the header and footer.
// Files live in /public: logo-landscape.png (wide) and logo-portrait.png (square).
const sizes = {
  sm: 'h-12 md:h-12',
  md: 'h-14 md:h-16',
  lg: 'h-16 md:h-20',
}

export default function Logo({ className = '', size = 'md', asLink = true }) {
  const img = (
    <img
      src="/logo-landscape.png"
      alt="BlinkSky Productions"
      className={`w-auto ${sizes[size]}`}
      width="300"
      height="120"
    />
  )

  if (!asLink) return <span className={className}>{img}</span>

  return (
    <a
      href="#top"
      className={`inline-flex items-center transition-opacity duration-300 hover:opacity-80 ${className}`}
      aria-label="BlinkSky Productions, home"
    >
      {img}
    </a>
  )
}
