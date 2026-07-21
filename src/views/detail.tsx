import { useState } from 'react'
import { YStack, XStack, ScrollView, Text, SizableText, Circle, Input } from '@hanzo/gui'
import { c, sentiments, sentimentColor, ago, swatches } from '../theme'
import type { Feedback, Theme } from '../types'
import { Caption, Chip, ActionBtn } from './ui'

const statusTone: Record<string, string> = {
  new: c.accent,
  triaged: '#34d399',
  archived: c.faint,
}

/** The right pane: read the item, tag sentiment + theme, then triage/archive. */
export function FeedbackDetail({
  item,
  themes,
  onPatch,
  onDelete,
  onAddTheme,
  busy,
}: {
  item: Feedback
  themes: Theme[]
  onPatch: (fields: Record<string, string>) => void
  onDelete: () => void
  onAddTheme: (name: string, color: string) => Promise<void>
  busy: boolean
}) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(swatches[0])

  async function addTheme() {
    const n = name.trim()
    if (!n || busy) return
    await onAddTheme(n, color)
    onPatch({ theme: n })
    setName('')
  }

  function toggleTheme(themeName: string) {
    onPatch({ theme: item.theme === themeName ? '' : themeName })
  }

  return (
    <YStack flex={1} backgroundColor={c.bg}>
      <ScrollView flex={1}>
        <YStack padding={22} gap={20} maxWidth={780} width="100%">
          {/* Header */}
          <XStack alignItems="center" justifyContent="space-between" gap={12}>
            <XStack alignItems="center" gap={9} flex={1}>
              <Circle size={9} backgroundColor={sentimentColor(item.sentiment)} />
              <SizableText size="$3" color={c.dim} textTransform="uppercase" letterSpacing={1}>
                {item.source || 'Unlabeled'}
              </SizableText>
              <SizableText size="$2" color={c.faint}>
                · received {ago(item.received_at) || '—'}
              </SizableText>
            </XStack>
            <XStack alignItems="center" gap={6}>
              <Circle size={7} backgroundColor={statusTone[item.status] ?? c.faint} />
              <SizableText size="$2" color={c.dim} textTransform="capitalize">
                {item.status}
              </SizableText>
            </XStack>
          </XStack>

          {/* Body */}
          <YStack
            padding={18}
            borderRadius={12}
            borderWidth={1}
            borderColor={c.line}
            backgroundColor={c.panel}
          >
            <Text fontSize={15} lineHeight={24} color={c.text}>
              {item.body}
            </Text>
          </YStack>

          {/* Sentiment */}
          <YStack gap={9}>
            <Caption>Sentiment</Caption>
            <XStack gap={8} flexWrap="wrap">
              {sentiments.map((s) => (
                <Chip
                  key={s.key}
                  label={s.label}
                  dotColor={s.color}
                  active={item.sentiment === s.key}
                  onPress={() => onPatch({ sentiment: s.key })}
                />
              ))}
            </XStack>
          </YStack>

          {/* Theme */}
          <YStack gap={9}>
            <Caption>Theme</Caption>
            {themes.length === 0 ? (
              <SizableText size="$2" color={c.faint}>
                No themes yet — name one below to start grouping feedback.
              </SizableText>
            ) : (
              <XStack gap={8} flexWrap="wrap">
                {themes.map((t) => (
                  <Chip
                    key={t.id}
                    label={t.name}
                    dotColor={t.color}
                    active={item.theme === t.name}
                    onPress={() => toggleTheme(t.name)}
                  />
                ))}
              </XStack>
            )}

            <XStack alignItems="center" gap={9} marginTop={4} flexWrap="wrap">
              <Input
                flex={1}
                minWidth={160}
                size="$3"
                value={name}
                placeholder="New theme…"
                backgroundColor={c.panelAlt}
                borderColor={c.line}
                color={c.text}
                onChangeText={setName}
                onSubmitEditing={addTheme}
              />
              <XStack gap={6} alignItems="center">
                {swatches.map((s) => (
                  <Circle
                    key={s}
                    size={18}
                    backgroundColor={s}
                    borderWidth={2}
                    borderColor={color === s ? c.text : 'transparent'}
                    cursor="pointer"
                    pressStyle={{ opacity: 0.8 }}
                    onPress={() => setColor(s)}
                  />
                ))}
              </XStack>
              <ActionBtn label="Add" onPress={addTheme} disabled={!name.trim() || busy} />
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>

      {/* Actions */}
      <XStack
        alignItems="center"
        gap={9}
        paddingHorizontal={22}
        paddingVertical={13}
        borderTopWidth={1}
        borderColor={c.line}
        backgroundColor={c.panel}
        flexWrap="wrap"
      >
        {item.status !== 'triaged' ? (
          <ActionBtn label="Triage" tone="primary" onPress={() => onPatch({ status: 'triaged' })} disabled={busy} />
        ) : null}
        {item.status !== 'archived' ? (
          <ActionBtn label="Archive" onPress={() => onPatch({ status: 'archived' })} disabled={busy} />
        ) : null}
        {item.status !== 'new' ? (
          <ActionBtn label="Reopen" onPress={() => onPatch({ status: 'new' })} disabled={busy} />
        ) : null}
        <YStack flex={1} minWidth={12} />
        <ActionBtn label="Delete" tone="danger" onPress={onDelete} disabled={busy} />
      </XStack>
    </YStack>
  )
}
