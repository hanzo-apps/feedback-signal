import { useIam } from '@hanzo/iam/react'
import { YStack, XStack, H1, Paragraph, SizableText, Text, Circle, Button } from '@hanzo/gui'
import { c, sentimentColor } from '../theme'
import { Chip } from './ui'

/** Sample rows powering the static hero preview (an illustration, not live data). */
const SAMPLE = [
  {
    source: 'Email',
    body: 'Export to CSV times out on large boards — it blocks our weekly report.',
    sentiment: 'negative',
    theme: 'Reliability',
    age: '2h',
    unread: true,
    selected: true,
  },
  {
    source: 'Intercom',
    body: 'The new keyboard shortcuts are a huge time saver. Love the direction.',
    sentiment: 'positive',
    theme: 'Delight',
    age: '5h',
    unread: false,
    selected: false,
  },
  {
    source: 'Sales call',
    body: 'Prospect needs SSO before they can roll us out company-wide.',
    sentiment: 'neutral',
    theme: 'Enterprise',
    age: '1d',
    unread: true,
    selected: false,
  },
  {
    source: 'App Store',
    body: 'Mobile app signs me out every couple of days. Frustrating.',
    sentiment: 'negative',
    theme: 'Reliability',
    age: '2d',
    unread: false,
    selected: false,
  },
]

function MiniRow({ row }: { row: (typeof SAMPLE)[number] }) {
  return (
    <XStack borderBottomWidth={1} borderColor={c.lineSoft} backgroundColor={row.selected ? c.rowSelected : 'transparent'}>
      <YStack width={3} backgroundColor={row.unread ? c.accent : 'transparent'} />
      <YStack flex={1} gap={4} paddingVertical={9} paddingHorizontal={11}>
        <XStack alignItems="center" justifyContent="space-between">
          <XStack alignItems="center" gap={6}>
            <Circle size={6} backgroundColor={sentimentColor(row.sentiment)} />
            <SizableText size="$1" color={c.faint} textTransform="uppercase" letterSpacing={0.6}>
              {row.source}
            </SizableText>
          </XStack>
          <SizableText size="$1" color={c.faint}>
            {row.age}
          </SizableText>
        </XStack>
        <Text numberOfLines={2} fontSize={12} lineHeight={16} color={row.unread ? c.text : c.dim} fontWeight={row.unread ? '600' : '400'}>
          {row.body}
        </Text>
      </YStack>
    </XStack>
  )
}

/** A non-interactive miniature of the console — sells the two-pane workflow. */
function Preview() {
  return (
    <YStack
      width="100%"
      maxWidth={560}
      borderRadius={14}
      borderWidth={1}
      borderColor={c.line}
      backgroundColor={c.panel}
      overflow="hidden"
    >
      <YStack height={3} backgroundColor={c.accent} opacity={0.7} />
      <XStack alignItems="center" justifyContent="space-between" paddingHorizontal={13} paddingVertical={10} borderBottomWidth={1} borderColor={c.line}>
        <XStack alignItems="center" gap={8}>
          <Circle size={16} backgroundColor={c.accentDim} borderWidth={1} borderColor={c.accent} alignItems="center" justifyContent="center">
            <Circle size={5} backgroundColor={c.accent} />
          </Circle>
          <SizableText size="$3" color={c.text} fontWeight="700">
            Signal
          </SizableText>
          <SizableText size="$1" color={c.faint}>
            · Feedback inbox
          </SizableText>
        </XStack>
        <XStack gap={5}>
          <Chip label="New 2" active />
          <Chip label="Triaged" />
        </XStack>
      </XStack>

      <XStack height={330}>
        <YStack width={214} borderRightWidth={1} borderColor={c.line}>
          {SAMPLE.map((row) => (
            <MiniRow key={row.source} row={row} />
          ))}
        </YStack>

        <YStack flex={1} padding={14} gap={13} backgroundColor={c.bg}>
          <XStack alignItems="center" justifyContent="space-between">
            <XStack alignItems="center" gap={7}>
              <Circle size={8} backgroundColor={sentimentColor('negative')} />
              <SizableText size="$2" color={c.dim} textTransform="uppercase" letterSpacing={0.8}>
                Email · 2h
              </SizableText>
            </XStack>
            <XStack alignItems="center" gap={5}>
              <Circle size={6} backgroundColor={c.accent} />
              <SizableText size="$1" color={c.dim}>
                New
              </SizableText>
            </XStack>
          </XStack>

          <YStack padding={12} borderRadius={9} borderWidth={1} borderColor={c.line} backgroundColor={c.panel}>
            <Text fontSize={12.5} lineHeight={19} color={c.text}>
              Export to CSV times out on large boards — it blocks our weekly report. Can we get a background export?
            </Text>
          </YStack>

          <YStack gap={7}>
            <SizableText size="$1" color={c.faint} textTransform="uppercase" letterSpacing={1}>
              Sentiment
            </SizableText>
            <XStack gap={6}>
              <Chip label="Positive" dotColor="#34d399" />
              <Chip label="Negative" dotColor="#fb7185" active />
            </XStack>
          </YStack>

          <YStack gap={7}>
            <SizableText size="$1" color={c.faint} textTransform="uppercase" letterSpacing={1}>
              Theme
            </SizableText>
            <XStack gap={6}>
              <Chip label="Reliability" dotColor="#6ea8fe" active />
              <Chip label="Exports" dotColor="#fbbf24" />
            </XStack>
          </YStack>
        </YStack>
      </XStack>
    </YStack>
  )
}

function Bullet({ children }: { children: string }) {
  return (
    <XStack alignItems="center" gap={10}>
      <Circle size={6} backgroundColor={c.accent} />
      <SizableText size="$3" color={c.dim}>
        {children}
      </SizableText>
    </XStack>
  )
}

/**
 * Signed-out landing. One action: PKCE sign-in with Hanzo (hanzo.id). There is
 * no local credential form — Hanzo IAM owns every credential interaction. The
 * preview is an illustration of the interface, not live data.
 */
export function SignedOut() {
  const { login, isLoading } = useIam()

  return (
    <YStack flex={1} minHeight="100vh" backgroundColor={c.bg}>
      <XStack alignItems="center" justifyContent="space-between" paddingHorizontal={28} paddingVertical={16} borderBottomWidth={1} borderColor={c.lineSoft}>
        <XStack alignItems="center" gap={10}>
          <Circle size={22} backgroundColor={c.accentDim} borderWidth={1} borderColor={c.accent} alignItems="center" justifyContent="center">
            <Circle size={7} backgroundColor={c.accent} />
          </Circle>
          <SizableText size="$5" color={c.text} fontWeight="700" letterSpacing={0.2}>
            Signal
          </SizableText>
        </XStack>
        <Button size="$3" chromeless disabled={isLoading} onPress={() => login()}>
          Sign in
        </Button>
      </XStack>

      <XStack
        flex={1}
        flexWrap="wrap"
        gap={48}
        paddingHorizontal={40}
        paddingVertical={56}
        maxWidth={1180}
        width="100%"
        alignSelf="center"
        alignItems="center"
        justifyContent="center"
      >
        <YStack flex={1} minWidth={340} maxWidth={520} gap={22}>
          <XStack alignSelf="flex-start" paddingHorizontal={11} paddingVertical={5} borderRadius={999} borderWidth={1} borderColor={c.line} backgroundColor={c.panel}>
            <SizableText size="$1" color={c.accent} textTransform="uppercase" letterSpacing={1.4}>
              Product feedback · triage inbox
            </SizableText>
          </XStack>

          <H1 fontSize={46} lineHeight={50} fontWeight="800" letterSpacing={-0.6} color={c.text}>
            Turn raw feedback into signal.
          </H1>

          <Paragraph fontSize={17} lineHeight={26} color={c.dim} maxWidth={480}>
            A two-pane inbox for incoming product feedback. Read it, tag it by theme and sentiment, and
            mark each item triaged or archived — a fast, focused way to make sense of what users tell you.
          </Paragraph>

          <YStack gap={11} marginTop={2}>
            <Bullet>Two-pane triage — the queue on the left, full context on the right</Bullet>
            <Bullet>Tag sentiment and theme as you read, mark triaged or archived</Bullet>
            <Bullet>Every item org-scoped and stored in Hanzo Base</Bullet>
          </YStack>

          <XStack alignItems="center" gap={14} marginTop={8} flexWrap="wrap">
            <Button size="$5" theme="active" disabled={isLoading} onPress={() => login()}>
              {isLoading ? 'Loading…' : 'Sign in with Hanzo'}
            </Button>
            <SizableText size="$2" color={c.faint}>
              Built on @hanzo/gui · Hanzo IAM · Hanzo Base
            </SizableText>
          </XStack>
        </YStack>

        <YStack flex={1} minWidth={360} maxWidth={560} alignItems="center">
          <Preview />
        </YStack>
      </XStack>
    </YStack>
  )
}
