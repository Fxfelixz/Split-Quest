import { QuestButton } from '@/components/shared/QuestButton'

export default function Home() {
  return (
    <div className="lp-root">
      <div className="lp-bg-texture" aria-hidden="true" />
      <div className="lp-bg-glow" aria-hidden="true" />

      {/* NAV */}
      <nav className="top">
        <div className="wrap nav-inner">
          <a href="#" className="brand">
            <span className="mark">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L10.5 6L14.5 6L11.3 8.5L12.5 13L9 10.5L5.5 13L6.7 8.5L3.5 6L7.5 6Z" fill="currentColor" />
              </svg>
            </span>
            Split<b>Quest</b>
          </a>
          <div className="nav-links">
            <a href="#features">Why</a>
            <a href="#how">How it works</a>
            <a href="#postcard">Share card</a>
            <a href="#start" className="nav-cta">Start your trip</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="wrap hero" id="start">
        <div className="hero-card">
          <span className="scatter s1">✦</span>
          <span className="scatter s2">◆</span>
          <span className="scatter s3">❖</span>

          <div className="hero-left">
            <div className="eyebrow">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1L7.2 4.4L10.5 4.4L7.85 6.4L8.85 9.8L6 7.8L3.15 9.8L4.15 6.4L1.5 4.4L4.8 4.4Z" fill="currentColor" />
              </svg>
              Free during beta
              <span className="sep">·</span>
              <span style={{ color: 'var(--muted)' }}>v0.4</span>
            </div>

            <h1 className="hero-title">
              Split the Quest<span className="comma">,</span><br />
              <span className="glory">
                Share the Glory.
                <svg viewBox="0 0 200 14" preserveAspectRatio="none" fill="none" aria-hidden="true">
                  <path d="M2 9 Q 30 4, 60 8 T 120 7 T 198 9" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="hero-sub">
              The cozy way to split trip expenses with your party. Track every penny, settle every bill, and end every trip the way it started — as friends.
            </p>

            <div className="cta-row">
              <QuestButton className="btn-primary">
                Start Your Quest
                <svg className="arr" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </QuestButton>
              <button className="btn-ghost">
                See how it works
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M5.5 4.5L9 7L5.5 9.5V4.5Z" fill="currentColor" />
                </svg>
              </button>
            </div>

            <div className="proof">
              <div className="dots">
                <span className="d1">A</span>
                <span className="d2">M</span>
                <span className="d3">R</span>
              </div>
              <div>
                Trusted by{' '}
                <b style={{ color: 'var(--ink-2)', fontFamily: "'JetBrains Mono', monospace" }}>0</b>
                {' '}adventurers so far <span title="cozy">🙂</span>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <span className="sticker">New Adventure!</span>
            <div className="trip-card">
              <div className="tc-header">
                <span className="tag">◆ Trip Card</span>
                <span className="num">No. 0001</span>
              </div>
              <div className="tc-scene">
                <span className="sun" />
                <span className="cloud c1" />
                <span className="cloud c2" />
                <div className="mountains">
                  <svg viewBox="0 0 200 80" preserveAspectRatio="none" fill="none">
                    <path d="M0 80 L0 50 L40 22 L70 48 L110 18 L155 44 L200 28 L200 80 Z" fill="#5e8c7a" />
                    <path d="M0 80 L0 62 L30 44 L60 58 L100 38 L140 56 L180 42 L200 50 L200 80 Z" fill="#4d806d" />
                    <path d="M0 80 L0 70 L40 62 L80 68 L130 60 L170 66 L200 62 L200 80 Z" fill="#2f6052" />
                  </svg>
                </div>
                <span className="pin" />
              </div>
              <div className="tc-body">
                <h3 className="tc-name">The Lisbon <em>Pilgrimage</em></h3>
                <p className="tc-place">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1.5C8 1.5 9.5 3 9.5 5C9.5 7.5 6 10.5 6 10.5C6 10.5 2.5 7.5 2.5 5C2.5 3 4 1.5 6 1.5Z" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="6" cy="5" r="1.2" fill="currentColor" />
                  </svg>
                  Lisbon, Portugal · 7 days
                </p>
                <div className="tc-party">
                  <div className="who">
                    <span className="ico">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.2" />
                        <circle cx="10" cy="6" r="1.6" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M1.5 11.5C2 9.5 3.5 8.5 5 8.5C6.5 8.5 8 9.5 8.5 11.5M9.5 11.5C9.8 10 11 9 12 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    </span>
                    Party of 4
                  </div>
                  <div className="avs">
                    <span className="a">A</span>
                    <span className="b">M</span>
                    <span className="c">R</span>
                    <span className="d">K</span>
                  </div>
                </div>
                <div className="tc-stats">
                  <div className="s"><div className="lbl">Days</div><div className="val">7</div></div>
                  <div className="s"><div className="lbl">Stops</div><div className="val">9</div></div>
                  <div className="s"><div className="lbl">Total</div><div className="val">$1.2<small>k</small></div></div>
                </div>
              </div>
              <div className="tc-footer">Settle as friends ✦</div>
            </div>
            <div className="stamp">Quest<br />Begins</div>
          </div>
        </div>

        {/* MOMENTS BAND */}
        <div className="moments">
          <div className="moments-inner">
            <div className="moment">
              <div className="ico gold"><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="5" fill="currentColor" /><path d="M13 2v3M13 21v3M2 13h3M21 13h3M5 5l2 2M19 19l2 2M5 21l2-2M19 7l2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></div>
              <div className="label">Set out</div>
            </div>
            <div className="moment">
              <div className="ico sage"><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M13 7L15 13L13 19L11 13Z" fill="currentColor" /><circle cx="13" cy="13" r="1.5" fill="currentColor" /></svg></div>
              <div className="label">Find way</div>
            </div>
            <div className="moment">
              <div className="ico terra"><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M3 21L9 9L13 16L17 11L23 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M10 14L13 19" stroke="currentColor" strokeWidth="1.4" /><circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.4" /></svg></div>
              <div className="label">See vistas</div>
            </div>
            <div className="moment">
              <div className="ico gold"><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 4L8 14H18Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M5 22L8 14M21 22L18 14M13 14V22M8 22H18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></div>
              <div className="label">Rest up</div>
            </div>
            <div className="moment">
              <div className="ico sage"><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M9 13L12 16L17 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              <div className="label">Settle</div>
            </div>
            <div className="moment">
              <div className="ico terra"><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 4L15.5 9L21 9.5L17 13.5L18 19L13 16.5L8 19L9 13.5L5 9.5L10.5 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg></div>
              <div className="label">Share</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="wrap section" id="features">
        <div className="section-head">
          <div className="section-kicker">Three Tools for the Road</div>
          <h2>Built for trips, <em>not spreadsheets</em>.</h2>
          <p>The smallest possible tool for the most awkward part of any group trip. We do the math; you do the memories.</p>
        </div>
        <div className="features">
          <article className="feature terra">
            <div className="ill">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="8" y="6" width="22" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12h22M14 6V3M24 6V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M13 18h14M13 23h10M13 28h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="29" cy="28" r="3" fill="currentColor" />
              </svg>
            </div>
            <h3>Log it like a journal</h3>
            <p>Snap a receipt, tag the party, done. Every entry syncs to the trip in real time so nobody has to &ldquo;remember who paid for the cab.&rdquo;</p>
            <div className="micro">◆ Real-time sync · <b>multi-currency</b></div>
          </article>
          <article className="feature sage">
            <div className="ill">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
                <path d="M20 6v28M6 20h28" stroke="currentColor" strokeWidth="2" />
                <circle cx="20" cy="20" r="4" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="28" cy="28" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <h3>Split however feels fair</h3>
            <p>Even shares. By item. By percentages. &ldquo;I only had the appetizer.&rdquo; The math just runs — quietly, in the background, in any currency.</p>
            <div className="micro">◆ Fair shares · <b>your rules</b></div>
          </article>
          <article className="feature gold">
            <div className="ill">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="6" y="8" width="28" height="22" rx="3" stroke="currentColor" strokeWidth="2" />
                <path d="M13 30v4M27 30v4M11 34h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 13L22 18L27 18L23 21L24.5 26L20 23L15.5 26L17 21L13 18L18 18Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>End with a card worth sharing</h3>
            <p>When the trip ends, SplitQuest hands you a cozy recap card with stamps, stats, and the places you wandered. Brag responsibly.</p>
            <div className="micro">◆ Auto-generated · <b>shareable</b></div>
          </article>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="wrap section journey" id="how">
        <div className="section-head">
          <div className="section-kicker">The Journey</div>
          <h2>From &ldquo;let&rsquo;s go&rdquo; to <em>&ldquo;we did&rdquo;</em>.</h2>
          <p>Three steps. Under a minute to start. The rest happens on the road.</p>
        </div>
        <div className="journey-grid">
          <div className="step">
            <div className="badge">
              <span className="num">01</span>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="20" cy="22" r="7" stroke="var(--terra)" strokeWidth="2" />
                <circle cx="36" cy="22" r="6" stroke="var(--sage)" strokeWidth="2" />
                <path d="M8 44C9 38 14 35 20 35C26 35 31 38 32 44M28 44C29 40 32 38 36 38C40 38 43 40 44 44" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h4>Gather your party</h4>
            <p>Name the trip, drop a destination, share a link. Everyone joins in one tap — no accounts needed to view.</p>
          </div>
          <div className="step">
            <div className="badge">
              <span className="num">02</span>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <rect x="12" y="10" width="32" height="36" rx="3" stroke="var(--ink)" strokeWidth="2" />
                <path d="M12 18h32" stroke="var(--ink)" strokeWidth="2" />
                <path d="M18 26h14M18 32h20M18 38h12" stroke="var(--terra)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="38" cy="38" r="4" fill="var(--gold)" />
              </svg>
            </div>
            <h4>Log along the way</h4>
            <p>Snap a receipt or type it in. Choose how it splits — equally, by item, by share. Multi-currency, handled.</p>
          </div>
          <div className="step">
            <div className="badge">
              <span className="num">03</span>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <path d="M28 8L31 16L40 17L33 23L35 32L28 27L21 32L23 23L16 17L25 16Z" stroke="var(--gold-deep)" strokeWidth="2" strokeLinejoin="round" fill="var(--gold-tint)" />
                <path d="M16 40C18 38 22 38 24 40M32 40C34 38 38 38 40 40" stroke="var(--terra)" strokeWidth="2" strokeLinecap="round" />
                <path d="M28 38v8" stroke="var(--sage)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h4>Settle, then share</h4>
            <p>See who owes who in the fewest possible transfers. Mark settled, get your cozy share card to drop in the chat.</p>
          </div>
        </div>
      </section>

      {/* POSTCARD */}
      <section className="wrap postcard-wrap" id="postcard">
        <div className="section-head">
          <div className="section-kicker">Souvenir from the Road</div>
          <h2>Every trip ends with a <em>postcard</em>.</h2>
          <p>One tap turns your settled quest into a cozy keepsake — stamps, stops, totals, and a moment worth sharing.</p>
        </div>
        <div className="postcard">
          <div className="pc-left">
            <div className="pc-stamp">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L11.7 6.2L16.2 6.5L12.8 9.4L13.9 13.8L10 11.4L6.1 13.8L7.2 9.4L3.8 6.5L8.3 6.2Z" fill="currentColor" />
              </svg>
              Quest<br />Complete
            </div>
            <p className="pc-greeting">Dear party of four,</p>
            <p className="pc-message">
              You wandered seven days through Lisbon — ate too much pastel de nata, climbed the castle, missed the tram twice, and somehow ended up at the same little tavern <em>three nights in a row</em>. Every coin is accounted for. Every memory is unspent.
            </p>
            <p className="pc-signoff">— With love,<br /><b>SplitQuest</b></p>
            <div className="pc-stamps">
              <span className="badge-stamp"><span className="dot" />Alfama</span>
              <span className="badge-stamp t"><span className="dot" />Belém</span>
              <span className="badge-stamp g"><span className="dot" />Sintra</span>
              <span className="badge-stamp"><span className="dot" />São Jorge</span>
            </div>
          </div>
          <div className="pc-right">
            <div className="pc-meta"><span className="pin" /> The Lisbon Pilgrimage</div>
            <h3 className="pc-trip-name">A Settled <em>Adventure</em></h3>
            <p className="pc-trip-when">Apr 14 — Apr 20 · 2026</p>
            <div className="pc-stats">
              <div className="pc-stat terra"><div className="l">Total spent</div><div className="v">$1,284<small>.50</small></div></div>
              <div className="pc-stat sage"><div className="l">Party size</div><div className="v">4</div></div>
              <div className="pc-stat"><div className="l">Stops</div><div className="v">9 <small>places</small></div></div>
              <div className="pc-stat"><div className="l">Settled in</div><div className="v">3 <small>txns</small></div></div>
            </div>
            <div className="pc-bottom"><span>Days on the road</span><b>7 / 7</b></div>
          </div>
        </div>
        <p className="postcard-caption">— and the group chat survived. —</p>
      </section>

      {/* CLOSING CTA */}
      <section className="wrap closer">
        <div className="closer-icons">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L11.5 6.5L16 6.5L12.3 9.3L13.5 14L10 11.4L6.5 14L7.7 9.3L4 6.5L8.5 6.5Z" fill="currentColor" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--sage)', alignSelf: 'center' }}>
            <rect x="3" y="3" width="8" height="8" transform="rotate(45 7 7)" fill="currentColor" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--gold-deep)' }}>
            <path d="M10 2L11.5 6.5L16 6.5L12.3 9.3L13.5 14L10 11.4L6.5 14L7.7 9.3L4 6.5L8.5 6.5Z" fill="currentColor" />
          </svg>
        </div>
        <h2>Ready to <em>gather your party</em>?</h2>
        <p>Start your first trip in under a minute. Free during beta. No installs — just a link.</p>
        <QuestButton className="btn-primary">
          Create your first quest
          <svg className="arr" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </QuestButton>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap foot-inner">
          <div className="foot-brand">
            <span style={{ display: 'inline-grid', placeItems: 'center', width: '24px', height: '24px', background: 'var(--terra)', color: 'var(--cream)', borderRadius: '7px' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L8.2 4.5L11.8 4.5L8.9 6.7L10 10.5L7 8.2L4 10.5L5.1 6.7L2.2 4.5L5.8 4.5Z" fill="currentColor" />
              </svg>
            </span>
            Split<b>Quest</b>
          </div>
          <div className="foot-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Changelog</a>
            <a href="#">Support</a>
            <a href="#">@splitquest</a>
          </div>
          <div className="foot-copy">© 2026 · v0.4 beta</div>
        </div>
      </footer>
    </div>
  )
}
