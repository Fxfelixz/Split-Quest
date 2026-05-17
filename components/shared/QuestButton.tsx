'use client'

import { useState } from 'react'

type Props = {
  className?: string
  children: React.ReactNode
}

export function QuestButton({ className, children }: Props) {
  const [celebrated, setCelebrated] = useState(false)

  function handleClick() {
    setCelebrated(true)
    setTimeout(() => setCelebrated(false), 1800)
  }

  return (
    <button className={className} onClick={handleClick}>
      {celebrated ? (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {' '}Quest begun!
        </>
      ) : children}
    </button>
  )
}
