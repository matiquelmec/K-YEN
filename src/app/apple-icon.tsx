import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAF8F5',
          borderRadius: '38px',
          border: '4px solid #E5D8CE',
          position: 'relative',
        }}
      >
        <svg
          viewBox="0 0 40 40"
          width="120"
          height="120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Línea de brisa continua (Seda) */}
          <path
            d="M10 21C13 14 17 14 20 20C23 26 27 26 30 19"
            stroke="#1D707F"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Punto de luz oro champagne */}
          <circle cx="20" cy="11.5" r="2.2" fill="#BFA15F" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
