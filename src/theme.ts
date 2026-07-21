/**
 * Signal's one visual language: a neutral-slate triage console. Colors live
 * here as raw values (Tamagui accepts them on backgroundColor/color/borderColor)
 * so the two-pane inbox reads as one dense, focused surface regardless of theme.
 */
export const c = {
  bg: '#090c14',
  panel: '#0e1320',
  panelAlt: '#111a2b',
  rowHover: '#141c2e',
  rowSelected: '#172138',
  line: '#1c2540',
  lineSoft: '#161d30',
  text: '#eef2fb',
  dim: '#9fabc4',
  faint: '#63718d',
  accent: '#6ea8fe',
  accentDim: '#1b2a49',
  danger: '#fb7185',
  dangerLine: '#7f1d2b',
}

/** The three sentiments a PM triages against. */
export const sentiments = [
  { key: 'positive', label: 'Positive', color: '#34d399' },
  { key: 'neutral', label: 'Neutral', color: '#94a3b8' },
  { key: 'negative', label: 'Negative', color: '#fb7185' },
] as const

export type SentimentKey = (typeof sentiments)[number]['key']

export function sentimentColor(key: string): string {
  return sentiments.find((s) => s.key === key)?.color ?? '#94a3b8'
}

/** Lifecycle: new (unread weight) → triaged | archived. */
export const statuses = ['new', 'triaged', 'archived'] as const
export type StatusKey = (typeof statuses)[number]

/** Quick-pick provenance for the capture view (also free-typed). */
export const sources = ['Email', 'Intercom', 'Twitter', 'Sales call', 'App Store', 'Support', 'Discord']

/** Swatches offered when naming a new theme. */
export const swatches = ['#6ea8fe', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#22d3ee', '#f472b6', '#94a3b8']

/** Compact relative age for a feedback row's received time. */
export function ago(iso?: string): string {
  if (!iso) return ''
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return ''
  const s = Math.max(0, (Date.now() - t) / 1000)
  if (s < 60) return 'now'
  const m = s / 60
  if (m < 60) return `${Math.floor(m)}m`
  const h = m / 60
  if (h < 24) return `${Math.floor(h)}h`
  const d = h / 24
  if (d < 7) return `${Math.floor(d)}d`
  const w = d / 7
  if (w < 5) return `${Math.floor(w)}w`
  return new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
