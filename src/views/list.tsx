import { YStack, XStack, ScrollView, Text, SizableText, Circle, Spinner, Paragraph } from '@hanzo/gui'
import { c, sentimentColor, ago } from '../theme'
import type { Feedback, Theme } from '../types'

function themeColor(themes: Theme[], name: string): string {
  return themes.find((t) => t.name === name)?.color ?? c.faint
}

/** One dense feedback row. Unread (status `new`) carries the visual weight. */
function Row({
  item,
  themes,
  selected,
  onSelect,
}: {
  item: Feedback
  themes: Theme[]
  selected: boolean
  onSelect: () => void
}) {
  const unread = item.status === 'new'
  return (
    <XStack
      borderBottomWidth={1}
      borderColor={c.lineSoft}
      backgroundColor={selected ? c.rowSelected : 'transparent'}
      cursor="pointer"
      hoverStyle={selected ? undefined : { backgroundColor: c.rowHover }}
      pressStyle={{ opacity: 0.9 }}
      onPress={onSelect}
    >
      <YStack width={3} backgroundColor={unread ? c.accent : 'transparent'} />
      <YStack flex={1} gap={5} paddingVertical={11} paddingHorizontal={13}>
        <XStack alignItems="center" justifyContent="space-between" gap={8}>
          <XStack alignItems="center" gap={7} flex={1}>
            <Circle size={7} backgroundColor={sentimentColor(item.sentiment)} />
            <SizableText size="$1" color={c.faint} textTransform="uppercase" letterSpacing={0.8} numberOfLines={1}>
              {item.source || 'Unlabeled'}
            </SizableText>
          </XStack>
          <SizableText size="$1" color={c.faint}>
            {ago(item.received_at)}
          </SizableText>
        </XStack>

        <Text
          numberOfLines={2}
          fontSize={13}
          lineHeight={18}
          color={unread ? c.text : c.dim}
          fontWeight={unread ? '600' : '400'}
        >
          {item.body}
        </Text>

        {item.theme ? (
          <XStack alignItems="center" gap={6}>
            <Circle size={6} backgroundColor={themeColor(themes, item.theme)} />
            <SizableText size="$1" color={c.faint}>
              {item.theme}
            </SizableText>
          </XStack>
        ) : null}
      </YStack>
    </XStack>
  )
}

/** The narrow left pane: a scrollable, keyboard-inbox-dense feedback queue. */
export function FeedbackList({
  items,
  themes,
  selectedId,
  onSelect,
  loading,
  error,
  filterLabel,
}: {
  items: Feedback[]
  themes: Theme[]
  selectedId: string | null
  onSelect: (id: string) => void
  loading: boolean
  error: Error | null
  filterLabel: string
}) {
  return (
    <YStack width={384} borderRightWidth={1} borderColor={c.line} backgroundColor={c.panel}>
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal={13}
        paddingVertical={10}
        borderBottomWidth={1}
        borderColor={c.line}
      >
        <SizableText size="$2" color={c.dim} fontWeight="600" textTransform="capitalize">
          {filterLabel}
        </SizableText>
        <SizableText size="$1" color={c.faint}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </SizableText>
      </XStack>

      {loading ? (
        <XStack alignItems="center" gap={8} padding={16} opacity={0.6}>
          <Spinner size="small" />
          <Text color={c.dim}>Loading feedback…</Text>
        </XStack>
      ) : error ? (
        <Paragraph padding={16} color={c.danger}>
          Couldn’t reach Base ({error.message}). Confirm VITE_HANZO_BASE_URL and that you’re signed in.
        </Paragraph>
      ) : items.length === 0 ? (
        <YStack padding={20} gap={6}>
          <Text color={c.dim} fontWeight="600">
            Inbox zero.
          </Text>
          <Paragraph size="$2" color={c.faint}>
            Nothing in this view. Capture a new piece of feedback to start triaging.
          </Paragraph>
        </YStack>
      ) : (
        <ScrollView flex={1}>
          {items.map((item) => (
            <Row
              key={item.id}
              item={item}
              themes={themes}
              selected={item.id === selectedId}
              onSelect={() => onSelect(item.id)}
            />
          ))}
        </ScrollView>
      )}
    </YStack>
  )
}
