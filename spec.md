# SyncTO Tech

## Current State
Full-stack one-page website for SyncTO Tech (IT support and tech installation, Greater Toronto Area). The draft has expired and needs to be rebuilt. All code and structure exists in workspace.

## Requested Changes (Diff)

### Add
- Nothing new; full rebuild from existing spec

### Modify
- Redeploy all existing functionality intact

### Remove
- Nothing

## Implementation Plan

1. **Backend (Motoko):** Contact form submission storage, admin authentication (SHA-256 hashed password), ticket numbering, notes per submission.
   - Admin credentials: username `daiyan018`, password hash for `SyncTO2026NewChapter!`

2. **Frontend (React/Tailwind):** One-page site with:
   - Navbar: SyncTO Tech wordmark (Sync=thin italic white, TO=800 weight orange #F2922B, Tech=regular white), dark navy bg (#1a2236), mobile hamburger with blur overlay
   - Hero: "Your Community's Tech Team", subheadline, CTA "Book a Free Consultation", tagline "GREATER TORONTO AREA"
   - What We Do: 6 service cards (Repairs & Setup, Networking, Security & Surveillance, Infrastructure, Smart Tech, Business Software)
   - Our Process: 4 steps (Consult, Plan, Install, Support)
   - Business IT Plans: Starter $150/mo, Growth $250/mo (Most Popular)
   - Why SyncTO Tech: 4 value props
   - Contact: form + contact info (647-581-2241, contact@syncto.ca)
   - Footer: SyncTO Tech tagline, links (Services, Business Plans, Contact)
   - Admin at /admin: password-protected, ticket list, clickable rows, notes

3. **ICP Static Files:**
   - `src/frontend/src/.ic-assets.json5` with `{"match": ".well-known", "ignore": false}`
   - `src/frontend/src/.well-known/ic-domains` with `www.syncto.ca`
