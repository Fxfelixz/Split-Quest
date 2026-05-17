# SplitQuest — Project Brief

> ⚔️ Micro-SaaS web app สำหรับหารบิลทริปแนว RPG พร้อม Share Card สรุปทริปอวดเพื่อน

---

## 🎯 Project Goal

สร้าง web app ที่ช่วยกลุ่มเพื่อน track ค่าใช้จ่ายในทริป → คำนวณว่าใครจ่ายใครเท่าไหร่ → จบทริปออกมาเป็น Share Card สวยๆ แชร์ลง social ได้

**Stage ปัจจุบัน: Pre-MVP / Beta development**
**Target ผู้ใช้: 5-10 คน (เพื่อนผู้พัฒนา) เพื่อเก็บ feedback**

---

## 🧰 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 14+ (App Router) |
| Language | TypeScript | strict mode |
| Styling | Tailwind CSS | latest |
| UI Components | shadcn/ui | latest |
| Database | Supabase Postgres | - |
| Auth | Supabase Auth (Google OAuth) | - |
| Image Export | html-to-image | latest |
| Hosting | Vercel | - |
| Package Manager | pnpm | (หรือ npm ถ้าไม่ถนัด) |

**ข้อบังคับ:**
- ใช้ Server Components เป็น default, ใช้ Client Components เมื่อจำเป็นเท่านั้น ('use client')
- ใช้ Server Actions สำหรับ mutation (อย่าสร้าง API routes ถ้าไม่จำเป็น)
- ห้ามใช้ class component
- ห้ามใช้ `any` ใน TypeScript

---

## 🎨 Design System

### Colors
```css
--primary: #6C5CE7        /* ม่วง mystical - main brand */
--primary-deep: #3D2C8D
--gold: #FDCB6E           /* เหลืองทอง - accent, success */
--gold-deep: #D4A24C
--green: #00B894          /* ยอดบวก */
--red: #FF6B6B            /* ยอดลบ */
--bg: #F8F9FE             /* light bg */
--bg-dark: #0a0a14        /* dark bg (สำหรับ share card) */
--surface: #FFFFFF
--ink: #1a1a2e            /* text primary */
--ink-soft: #4a4a68       /* text secondary */
```

### Typography
- **Display/Title**: `Cinzel` (RPG vibe) — สำหรับ logo, share card title
- **Heading**: `Plus Jakarta Sans` 700-800
- **Body**: `Plus Jakarta Sans` 400-500
- **Numbers/Money**: `JetBrains Mono` 600-700
- **Italic accent**: `Instrument Serif` (sparingly)
- **Game label**: `Press Start 2P` (เฉพาะ badge/role label เล็กๆ)

### Spacing (8px grid)
xs:4 sm:8 md:16 lg:24 xl:32 2xl:48 3xl:64

### Border Radius
sm:8 md:12 lg:16 xl:24 (cards) full (avatars)

### Component principles
- Buttons: rounded-lg, soft shadow, hover scale 1.02
- Cards: rounded-xl, shadow-sm, border-gray-100
- Inputs: rounded-md, focus ring primary
- Money values: always use mono font + format `฿1,234.56`

---

## 📁 Folder Structure (target)

```
splitquest/
├── app/                    # Next.js App Router
│   ├── (auth)/            # auth pages (login, callback)
│   ├── (app)/             # protected app pages
│   │   ├── dashboard/
│   │   ├── trip/[id]/
│   │   └── settle/[id]/
│   ├── join/[code]/       # invite link handler
│   ├── api/               # API routes (if needed)
│   └── layout.tsx
├── components/
│   ├── ui/                # shadcn primitives
│   ├── trip/              # trip-related components
│   ├── expense/           # expense-related components
│   ├── share-card/        # share card variants
│   └── shared/            # navigation, header, etc.
├── lib/
│   ├── supabase/          # supabase clients (server/client/middleware)
│   ├── calculations/      # split logic, settlement algo
│   ├── roles/             # auto-role assignment
│   └── utils.ts
├── types/                 # TypeScript types
├── hooks/                 # custom React hooks
└── CLAUDE.md
```

---

## 🗄️ Database Schema (Supabase)

ดูไฟล์ `schema.sql` สำหรับ DDL เต็มๆ สรุป tables:

- **profiles** — ข้อมูล user (extends auth.users)
- **trips** — ทริป
- **trip_members** — สมาชิกในทริป (many-to-many)
- **invites** — invite codes
- **expenses** — รายการค่าใช้จ่าย
- **expense_splits** — การหารแต่ละคนรับเท่าไหร่
- **trip_summaries** — snapshot ตอนปิดทริป (สำหรับ share card)

**Row Level Security (RLS):** เปิดทุก table — user เห็นแค่ trip ที่ตัวเองเป็นสมาชิก

---

## 🧮 Core Business Logic

### Expense Calculation Order
1. Subtotal = sum(item amounts)
2. After discount = Subtotal - discount
3. After service = After discount × (1 + service_pct/100)
4. **Final = After service × (1 + vat_pct/100)**

### Split Modes
- `equal` — หารเท่ากันทุกคนที่ติ๊กไว้
- `custom_amount` — กำหนดยอดแต่ละคนเอง (ต้องรวมเท่า final)
- `custom_percent` — กำหนด % แต่ละคน (ต้องรวมเท่า 100%)
- `by_shares` — กำหนดจำนวน share (เช่น คน A 2 share, B 1 share)

### Settlement Algorithm
ใช้ greedy algorithm — จับคู่คนติดลบสุดกับคนบวกสุด โอนให้สมดุล ทำซ้ำจนทุกคน = 0

### Role Assignment (หลังปิดทริป)
```typescript
// Pseudo logic
Tank       → paid_total > 30% of trip_total
Merchant   → sum(discount_used) > 200 THB OR 5% of trip
Glutton    → category 'food'/'drink' share > 25% of own share
Big Spender → highest individual share in trip
Frugal     → lowest individual share in trip
Strategist → trip owner + most expenses added
Wildcard   → fallback ถ้าไม่ได้ role อื่น
```

**กฎ:** 1 คน = 1 role หลัก (เลือกตามลำดับ priority ด้านบน)

---

## 🎴 Share Card

มี 3 variants:
1. **Quest Complete** — RPG classic (ม่วง+ทอง+particles)
2. **Party Stats** — modern minimal (ครีม+ดำ)
3. **Achievement Unlocked** — trophy case (badges + tiers)

Export size: **1080 × 1350 px** (IG portrait)
ใช้ `html-to-image` แปลง DOM → PNG → download

**Beta scope:** ทำแค่ variant 1 (Quest Complete) ก่อน

---

## ✅ Conventions

### Naming
- Component files: `PascalCase.tsx` (e.g. `TripCard.tsx`)
- Util files: `camelCase.ts`
- Database columns: `snake_case`
- TypeScript types: `PascalCase`

### Money Handling
- เก็บใน DB เป็น `numeric(12, 2)` (ทศนิยม 2 ตำแหน่ง)
- ในโค้ดใช้ `number` แต่ระวัง floating point (ปัดทศนิยม 2 ตำแหน่งเสมอตอน display)
- Format: `formatMoney(1234.56)` → `"฿1,234.56"`

### Error Handling
- ทุก server action ต้อง return `{ success: boolean, data?, error? }`
- Show toast ด้วย `sonner` library
- Log error ลง console + Sentry (post-Beta)

### Component Pattern
```tsx
// ✅ Good
type Props = {
  expense: Expense
  onEdit?: (id: string) => void
}

export function ExpenseRow({ expense, onEdit }: Props) {
  // ...
}

// ❌ Bad
export const ExpenseRow = (props: any) => { ... }
```

---

## 🚫 Out of Scope (Beta)

ห้ามเพิ่ม feature เหล่านี้ใน Beta — จดไว้ทำหลัง launch:
- Payment integration
- Email notifications
- Multi-currency
- Receipt OCR scanning
- Recurring expenses
- Expense categories ที่ custom เองได้
- Dark mode
- i18n (อังกฤษอย่างเดียวพอ + ข้อความไทยใน UI fixed)
- Settings page
- Export PDF
- Share Card variant 2 & 3 (เก็บไว้ V1)

---

## 🎯 Definition of Done (Beta)

A feature is **DONE** when:
- [ ] โค้ดทำงานได้ (manual test แล้ว)
- [ ] TypeScript ไม่มี error
- [ ] Responsive อย่างน้อยไม่พังบน mobile (≥375px)
- [ ] มี empty state + loading state
- [ ] Commit ขึ้น git แล้ว

---

## 💬 Working with Claude Code

เวลา prompt Claude Code:
1. **ระบุ context ให้ครบ** — บอกว่าตอนนี้อยู่ week ไหน, ต้องการ output อะไร
2. **อ้างถึงไฟล์ที่เกี่ยวข้อง** — `@CLAUDE.md`, `@schema.sql`, `@components/...`
3. **ขอ explain** — ถ้าไม่เข้าใจโค้ด ให้บอกว่า "อธิบาย logic ทีละบรรทัด"
4. **ขอ test** — "เขียน test case manual ที่ผมต้องไปลองด้วย"
5. **อย่ารับโค้ดที่ไม่เข้าใจ** — ถ้างง ถาม Claude ก่อน commit

---

_Last updated: 2026-05-17_
