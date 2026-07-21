import { useState } from 'react'
import { YStack, XStack, ScrollView, H2, Paragraph, Input, TextArea, SizableText } from '@hanzo/gui'
import { c, sentiments, sources } from '../theme'
import type { Theme } from '../types'
import { Caption, Chip, ActionBtn } from './ui'

export interface Draft {
  source: string
  body: string
  sentiment: string
  theme: string
}

/** The capture view: log a new piece of feedback into the inbox as `new`. */
export function Capture({
  themes,
  onSubmit,
  onCancel,
  busy,
}: {
  themes: Theme[]
  onSubmit: (draft: Draft) => void
  onCancel: () => void
  busy: boolean
}) {
  const [source, setSource] = useState('')
  const [body, setBody] = useState('')
  const [sentiment, setSentiment] = useState('neutral')
  const [theme, setTheme] = useState('')

  const ready = !!body.trim() && !!source.trim() && !busy

  function submit() {
    if (!ready) return
    onSubmit({ source: source.trim(), body: body.trim(), sentiment, theme })
  }

  return (
    <YStack flex={1} backgroundColor={c.bg}>
      <ScrollView flex={1}>
        <YStack padding={24} gap={22} maxWidth={680} width="100%" alignSelf="center">
          <YStack gap={4}>
            <H2 fontSize={24} fontWeight="700" color={c.text}>
              Log feedback
            </H2>
            <Paragraph size="$3" color={c.faint}>
              Drop in something a user said. It lands in the inbox as new, ready to triage.
            </Paragraph>
          </YStack>

          {/* Source */}
          <YStack gap={9}>
            <Caption>Source</Caption>
            <Input
              size="$4"
              value={source}
              placeholder="Where did this come from?"
              backgroundColor={c.panel}
              borderColor={c.line}
              color={c.text}
              onChangeText={setSource}
            />
            <XStack gap={7} flexWrap="wrap">
              {sources.map((s) => (
                <Chip key={s} label={s} active={source === s} onPress={() => setSource(s)} />
              ))}
            </XStack>
          </YStack>

          {/* Body */}
          <YStack gap={9}>
            <Caption>Feedback</Caption>
            <TextArea
              value={body}
              placeholder="Paste or type the raw feedback…"
              minHeight={150}
              backgroundColor={c.panel}
              borderColor={c.line}
              color={c.text}
              onChangeText={setBody}
            />
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
                  active={sentiment === s.key}
                  onPress={() => setSentiment(s.key)}
                />
              ))}
            </XStack>
          </YStack>

          {/* Theme */}
          {themes.length > 0 ? (
            <YStack gap={9}>
              <Caption>Theme</Caption>
              <XStack gap={8} flexWrap="wrap">
                {themes.map((t) => (
                  <Chip
                    key={t.id}
                    label={t.name}
                    dotColor={t.color}
                    active={theme === t.name}
                    onPress={() => setTheme(theme === t.name ? '' : t.name)}
                  />
                ))}
              </XStack>
            </YStack>
          ) : null}

          <XStack gap={9} marginTop={4} alignItems="center">
            <ActionBtn label={busy ? 'Saving…' : 'Log feedback'} tone="primary" onPress={submit} disabled={!ready} />
            <ActionBtn label="Cancel" onPress={onCancel} disabled={busy} />
            {!source.trim() || !body.trim() ? (
              <SizableText size="$1" color={c.faint}>
                Source and feedback are required.
              </SizableText>
            ) : null}
          </XStack>
        </YStack>
      </ScrollView>
    </YStack>
  )
}
