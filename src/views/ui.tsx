import { XStack, SizableText, Circle } from '@hanzo/gui'
import { c } from '../theme'

/** A small uppercase section label — the console's field captions. */
export function Caption({ children }: { children: string }) {
  return (
    <SizableText size="$1" color={c.faint} textTransform="uppercase" letterSpacing={1}>
      {children}
    </SizableText>
  )
}

/**
 * The one pill primitive: sentiment, theme, source and status filters are all
 * Chips. Interactive when `onPress` is given; `active` outlines it in accent.
 */
export function Chip({
  label,
  active,
  dotColor,
  onPress,
  disabled,
}: {
  label: string
  active?: boolean
  dotColor?: string
  onPress?: () => void
  disabled?: boolean
}) {
  const clickable = !!onPress && !disabled
  return (
    <XStack
      alignItems="center"
      gap={6}
      paddingHorizontal={10}
      paddingVertical={5}
      borderRadius={999}
      borderWidth={1}
      borderColor={active ? c.accent : c.line}
      backgroundColor={active ? c.accentDim : 'transparent'}
      opacity={disabled ? 0.4 : 1}
      cursor={clickable ? 'pointer' : 'default'}
      hoverStyle={clickable ? { borderColor: c.accent, backgroundColor: c.rowHover } : undefined}
      pressStyle={clickable ? { opacity: 0.85 } : undefined}
      onPress={clickable ? onPress : undefined}
    >
      {dotColor ? <Circle size={7} backgroundColor={dotColor} /> : null}
      <SizableText size="$2" color={active ? c.text : c.dim} fontWeight={active ? '600' : '400'}>
        {label}
      </SizableText>
    </XStack>
  )
}

/** A framed action: Triage (primary), Archive/Reopen (default), Delete (danger). */
export function ActionBtn({
  label,
  onPress,
  tone = 'default',
  disabled,
}: {
  label: string
  onPress: () => void
  tone?: 'default' | 'primary' | 'danger'
  disabled?: boolean
}) {
  const border = tone === 'primary' ? c.accent : tone === 'danger' ? c.dangerLine : c.line
  const bg = tone === 'primary' ? c.accentDim : 'transparent'
  const col = tone === 'primary' ? c.text : tone === 'danger' ? c.danger : c.dim
  return (
    <XStack
      alignItems="center"
      justifyContent="center"
      paddingHorizontal={14}
      paddingVertical={8}
      borderRadius={8}
      borderWidth={1}
      borderColor={border}
      backgroundColor={bg}
      opacity={disabled ? 0.5 : 1}
      cursor={disabled ? 'default' : 'pointer'}
      hoverStyle={disabled ? undefined : { borderColor: tone === 'danger' ? c.danger : c.accent }}
      pressStyle={disabled ? undefined : { opacity: 0.85 }}
      onPress={disabled ? undefined : onPress}
    >
      <SizableText size="$2" color={col} fontWeight="600">
        {label}
      </SizableText>
    </XStack>
  )
}
