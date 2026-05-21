'use client'

import { useRouter } from 'next/navigation'

type Props = {
  className?: string
  children: React.ReactNode
}

export function QuestButton({ className, children }: Props) {
  const router = useRouter()

  return (
    <button className={className} onClick={() => router.push('/login')}>
      {children}
    </button>
  )
}
