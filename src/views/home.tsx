import { useState, useMemo, useEffect } from 'react'
import { useIam } from '@hanzo/iam/react'
import { useQuery, useMutation } from '@hanzo/base/react'
import { YStack, XStack, Circle, SizableText, Button, Paragraph } from '@hanzo/gui'
import { c } from '../theme'
import type { Feedback, Theme } from '../types'
import { Chip } from './ui'
import { FeedbackList } from './list'
import { FeedbackDetail } from './detail'
import { Capture, type Draft } from './capture'

type Filter = 'new' | 'triaged' | 'archived' | 'all'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'new', label: 'New' },
  { key: 'triaged', label: 'Triaged' },
  { key: 'archived', label: 'Archived' },
  { key: 'all', label: 'All' },
]

/** The signed-in triage console: two panes over the org-scoped feedback inbox. */
export function Home() {
  const { user, logout } = useIam()
  const who = user?.displayName || user?.name || user?.email || 'you'

  const fb = useQuery<Feedback>('feedback', { sort: '-received_at', realtime: false })
  const th = useQuery<Theme>('themes', { sort: 'name', realtime: false })
  const createFb = useMutation('feedback', 'create')
  const updateFb = useMutation('feedback', 'update')
  const deleteFb = useMutation('feedback', 'delete')
  const createTh = useMutation('themes', 'create')

  const [filter, setFilter] = useState<Filter>('new')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode, setMode] = useState<'inbox' | 'capture'>('inbox')

  const counts = useMemo(() => {
    const acc: Record<string, number> = { all: fb.data.length, new: 0, triaged: 0, archived: 0 }
    for (const f of fb.data) acc[f.status] = (acc[f.status] ?? 0) + 1
    return acc
  }, [fb.data])

  const filtered = useMemo(
    () => (filter === 'all' ? fb.data : fb.data.filter((f) => f.status === filter)),
    [fb.data, filter],
  )

  const selected = useMemo(() => fb.data.find((f) => f.id === selectedId) ?? null, [fb.data, selectedId])

  // Superhuman-style: keep a row focused so the detail pane is never idle.
  useEffect(() => {
    if (mode === 'inbox' && !selectedId && filtered.length) setSelectedId(filtered[0].id)
  }, [mode, selectedId, filtered])

  const writing = updateFb.isLoading || deleteFb.isLoading

  async function patch(id: string, fields: Record<string, string>) {
    await updateFb.mutate({ id, ...fields })
    await fb.refetch()
  }

  async function remove(id: string) {
    await deleteFb.mutate({ id })
    setSelectedId(null)
    await fb.refetch()
  }

  async function addTheme(name: string, color: string) {
    await createTh.mutate({ name, color })
    await th.refetch()
  }

  async function addFeedback(draft: Draft) {
    const rec = await createFb.mutate({ ...draft, status: 'new', received_at: new Date().toISOString() })
    await fb.refetch()
    setMode('inbox')
    setFilter('new')
    if (rec) setSelectedId(rec.id)
  }

  return (
    <YStack flex={1} minHeight="100vh" backgroundColor={c.bg}>
      {/* Top bar */}
      <XStack
        alignItems="center"
        justifyContent="space-between"
        gap={16}
        paddingHorizontal={16}
        paddingVertical={11}
        borderBottomWidth={1}
        borderColor={c.line}
        backgroundColor={c.panel}
        flexWrap="wrap"
      >
        <XStack alignItems="center" gap={10}>
          <Circle
            size={24}
            backgroundColor={c.accentDim}
            borderWidth={1}
            borderColor={c.accent}
            alignItems="center"
            justifyContent="center"
          >
            <Circle size={8} backgroundColor={c.accent} />
          </Circle>
          <SizableText size="$5" color={c.text} fontWeight="700" letterSpacing={0.2}>
            Signal
          </SizableText>
          <SizableText size="$2" color={c.faint}>
            · Feedback inbox
          </SizableText>
        </XStack>

        <XStack alignItems="center" gap={7} flexWrap="wrap">
          {FILTERS.map((f) => (
            <Chip
              key={f.key}
              label={`${f.label} ${counts[f.key] ?? 0}`}
              active={filter === f.key}
              onPress={() => {
                setFilter(f.key)
                setMode('inbox')
              }}
            />
          ))}
        </XStack>

        <XStack alignItems="center" gap={10}>
          <SizableText size="$1" color={c.faint}>
            {who}
          </SizableText>
          <Button size="$3" theme="active" onPress={() => setMode('capture')}>
            Log feedback
          </Button>
          <Button size="$3" chromeless onPress={() => logout()}>
            Sign out
          </Button>
        </XStack>
      </XStack>

      {/* Two panes */}
      <XStack flex={1}>
        <FeedbackList
          items={filtered}
          themes={th.data}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id)
            setMode('inbox')
          }}
          loading={fb.isLoading}
          error={fb.error}
          filterLabel={filter === 'all' ? 'All feedback' : filter}
        />

        {mode === 'capture' ? (
          <Capture
            themes={th.data}
            onSubmit={addFeedback}
            onCancel={() => setMode('inbox')}
            busy={createFb.isLoading}
          />
        ) : selected ? (
          <FeedbackDetail
            item={selected}
            themes={th.data}
            onPatch={(fields) => patch(selected.id, fields)}
            onDelete={() => remove(selected.id)}
            onAddTheme={addTheme}
            busy={writing}
          />
        ) : (
          <YStack flex={1} alignItems="center" justifyContent="center" gap={10} padding={40} backgroundColor={c.bg}>
            <SizableText size="$6" color={c.dim} fontWeight="600">
              Nothing selected
            </SizableText>
            <Paragraph size="$3" color={c.faint} textAlign="center" maxWidth={360}>
              Pick a row to read it, tag its sentiment and theme, then triage or archive it.
            </Paragraph>
            <Button size="$3" theme="active" onPress={() => setMode('capture')}>
              Log feedback
            </Button>
          </YStack>
        )}
      </XStack>
    </YStack>
  )
}
