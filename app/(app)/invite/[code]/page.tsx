import { getInviteInfo } from '@/lib/invite/actions'
import { JoinButton } from './JoinButton'

type Props = { params: Promise<{ code: string }> }

export default async function InvitePage({ params }: Props) {
  const { code } = await params
  const result = await getInviteInfo(code)

  if (!result.success) {
    return (
      <div className="invite-root">
        <div className="invite-card">
          <div className="invite-emoji">🔒</div>
          <h1 className="invite-trip-name">Invalid Invite</h1>
          <p className="invite-meta">{result.error}</p>
          <a href="/dashboard" className="invite-join-btn" style={{ display: 'block', textDecoration: 'none' }}>
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  const { trip } = result.data

  return (
    <div className="invite-root">
      <div className="invite-card">
        <div className="invite-emoji">{trip.cover_emoji ?? '🎒'}</div>
        <h1 className="invite-trip-name">{trip.name}</h1>
        <p className="invite-meta">
          {trip.member_count} {trip.member_count === 1 ? 'hero' : 'heroes'} on this quest
        </p>
        <JoinButton code={code} />
        <a
          href="/dashboard"
          style={{
            display: 'block',
            marginTop: '12px',
            fontSize: '13px',
            color: 'var(--muted-foreground)',
            textDecoration: 'none',
          }}
        >
          Back to dashboard
        </a>
      </div>
    </div>
  )
}
