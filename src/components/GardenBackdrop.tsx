export function GardenBackdrop() {
  return (
    <div className="garden" aria-hidden="true">
      <svg className="sprig tl" viewBox="0 0 200 200">
        <Sprig />
      </svg>
      <svg className="sprig tr" viewBox="0 0 200 200">
        <Sprig />
      </svg>
      <svg className="sprig bl" viewBox="0 0 200 200">
        <Sprig />
      </svg>
      <svg className="sprig br" viewBox="0 0 200 200">
        <Sprig />
      </svg>
    </div>
  )
}

function Sprig() {
  return (
    <>
      <path
        d="M18 176C42 132 36 86 78 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M34 150c16-6 22 8 8 16-16 4-22-8-8-16z"
        fill="currentColor"
      />
      <path
        d="M48 118c18-4 20 12 4 16-16 2-20-10-4-16z"
        fill="currentColor"
      />
      <path
        d="M40 86c14-10 26 2 12 12-14 6-22-4-12-12z"
        fill="currentColor"
      />
      <path
        d="M78 48c8 10 2 18-6 16 2-8 0-14 6-16z"
        fill="currentColor"
      />
      <circle cx="86" cy="40" r="11" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="86" cy="40" r="6" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="86" cy="40" r="2.2" fill="currentColor" />
      <path
        d="M74 34c4-8 14-8 18 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </>
  )
}
