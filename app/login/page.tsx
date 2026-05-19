import { GoogleSignInButton } from '@/components/shared/GoogleSignInButton'

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <div className="lp-root login-root">
      <div className="login-card">
        <div className="login-emblem" aria-hidden="true">⚔️</div>
        <h1 className="login-title">SplitQuest</h1>
        <p className="login-sub">หารบิลทริปแบบ RPG<br />แบ่งยอด ปิดเควสต์ อวดเพื่อน</p>
        <div className="login-divider" />
        <GoogleSignInButton />
        <p className="login-note">
          เข้าสู่ระบบครั้งแรก → บัญชีจะถูกสร้างอัตโนมัติ
        </p>
      </div>
    </div>
  )
}
