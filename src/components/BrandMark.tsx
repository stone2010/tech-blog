export default function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="brand-mark"
    >
      <path d="M16 2.8 28 9.4v13.2L16 29.2 4 22.6V9.4L16 2.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 9.4 16 16l12-6.6M16 16v13.2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="16" cy="16" r="2.1" fill="currentColor" />
    </svg>
  )
}
