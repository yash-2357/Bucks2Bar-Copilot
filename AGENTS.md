# Agent Rules — Bucks2Bar

## Mandatory Pre-flight Check

**Before writing, editing, or reviewing any code in this repository, every agent MUST:**

1. Read `.github/copilot-instructions.md` in full.
2. Confirm understanding of every section before proceeding.
3. Apply all conventions described there without exception.

If the instructions file cannot be read, stop and notify the user — do not proceed with guesses.

---

## What the Instructions File Governs

| Section | What it enforces |
|---|---|
| File Structure | Only `index.html` and `script.js`; no extra files unless explicitly asked |
| Dependencies | Bootstrap 5.3.3 and Chart.js 4.4.4 via jsDelivr CDN only |
| JS Conventions | Section comments, `inrFmt` formatter, single `DOMContentLoaded` listener, single chart instance |
| HTML/CSS Conventions | Pink buttons, right-aligned number inputs, net-value colour classes, gradient header colours |
| Accessibility | `aria-label` on every input; ARIA attributes on all tab elements |
| Currency & Locale | INR / `en-IN` only; fiscal year label "FY 2026" |
| Prohibited Actions | No backend, no localStorage, no frameworks, no build tools |

---

## Enforcement Rules

- **Do not** introduce patterns, libraries, or conventions not described in the instructions file.
- **Do not** skip reading the instructions and rely on memory or assumptions.
- **Do not** make any change that contradicts the instructions file, even if the user's request appears to imply it — ask for clarification first.
- Every code change must be traceable back to a rule in the instructions file or an explicit user request made after the instructions were read.
