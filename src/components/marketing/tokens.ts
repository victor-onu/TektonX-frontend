import type { CSSProperties } from 'react'

// Plain style-object constants shared between the Home and About pages.
// Kept out of `ui.tsx` (which exports components only) so react-refresh's
// "fast refresh only works when a file only exports components" rule stays
// happy for that file.
export const eyebrowStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: '#9333EA',
}
