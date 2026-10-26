type EnvelopeProps = {
  opening: boolean
  onOpen: () => void
}

const petals = [
  { left: '8%', delay: '0s', duration: '11s', size: 9 },
  { left: '18%', delay: '2s', duration: '13s', size: 7 },
  { left: '28%', delay: '0.6s', duration: '10s', size: 11 },
  { left: '40%', delay: '3.2s', duration: '14s', size: 8 },
  { left: '52%', delay: '1.4s', duration: '12s', size: 10 },
  { left: '63%', delay: '4s', duration: '15s', size: 7 },
  { left: '74%', delay: '0.2s', duration: '11s', size: 12 },
  { left: '86%', delay: '2.6s', duration: '13s', size: 8 },
  { left: '12%', delay: '5s', duration: '16s', size: 6 },
  { left: '93%', delay: '1s', duration: '12s', size: 9 },
]

function SealMark() {
  return (
    <svg viewBox="0 0 88 88" aria-hidden="true">
      <circle cx="44" cy="44" r="40" fill="#6d2030" />
      <circle cx="44" cy="44" r="33" fill="none" stroke="#f0e2bf" strokeWidth="1.4" />
      <circle cx="44" cy="44" r="28" fill="none" stroke="#f0e2bf" strokeWidth="0.6" />
      <path
        d="M44 18 v9 M39.5 22.5 h9"
        stroke="#f8f1e4"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <text
        x="44"
        y="52"
        textAnchor="middle"
        fill="#f8f1e4"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="15"
        letterSpacing="1"
      >
        R · J
      </text>
    </svg>
  )
}

export function Envelope({ opening, onOpen }: EnvelopeProps) {
  return (
    <div className={`envelope-screen ${opening ? 'is-opening' : ''}`}>
      <div className="petals" aria-hidden="true">
        {petals.map((petal) => (
          <span
            key={`${petal.left}-${petal.delay}`}
            className="petal"
            style={{
              left: petal.left,
              animationDelay: petal.delay,
              animationDuration: petal.duration,
              width: petal.size,
              height: petal.size * 1.45,
            }}
          />
        ))}
      </div>

      <div className="envelope-frame" aria-hidden="true" />

      <p className="env-kicker">You are invited</p>
      <h1 className="env-names">
        Rahul <em>&</em> Jovial
      </h1>
      <p className="env-ml" lang="ml">
        സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു
      </p>

      <div className="envelope-scene">
        <div className={`envelope ${opening ? 'open' : ''}`}>
          <div className="env-back" />
          <div className="env-letter">
            <span className="env-letter-cross" aria-hidden="true">
              ✝
            </span>
            <strong>Rahul & Jovial</strong>
            <span>Holy Matrimony</span>
          </div>
          <div className="env-pocket" />
          <div className="env-flap">
            <div className="flap-face flap-back" />
            <div className="flap-face flap-front" />
          </div>
          <button
            type="button"
            className="seal"
            onClick={onOpen}
            aria-label="Open the invitation"
          >
            <SealMark />
          </button>
        </div>
      </div>

      <p className="env-hint">Tap the seal</p>
    </div>
  )
}
