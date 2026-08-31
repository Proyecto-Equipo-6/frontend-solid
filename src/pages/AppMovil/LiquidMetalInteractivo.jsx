import { useState } from 'react'
import { LiquidMetal } from '@paper-design/shaders-react'

export default function LiquidMetalInteractivo() {
  const [reducirMovimiento] = useState(
    () =>
      typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches),
  )

  return (
    <div className="appm__hero-visual">
      <LiquidMetal
        width="100%"
        height="100%"
        shape="metaballs"
        fit="contain"
        colorBack="#ffffff00"
        colorTint="#1d4ed8"
        repetition={3}
        softness={0.7}
        shiftRed={0.15}
        shiftBlue={0.2}
        distortion={0.14}
        contour={0.4}
        angle={45}
        speed={reducirMovimiento ? 0 : 1}
        scale={0.8}
      />
    </div>
  )
}