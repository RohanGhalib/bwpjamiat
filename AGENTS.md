<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Centralized Contacts & Leads Architecture Standard

## 1. Single Source of Truth (`contacts` Collection)
All attendee signups, volunteer applications, Quran Club registrations, Summer School entries, event RSVPs, and contact form leads MUST be unified and ingested into the central Firestore collection: `contacts`.

## 2. Rule for ALL New Event Signups and Forms
Whenever you create a new public form, event registration route, or intake pipeline:
- **NEVER** create an isolated, disconnected collection without also synchronizing to `contacts`.
- **ALWAYS** call `upsertContact()` from `@/lib/contacts` during form submission handling.
- `upsertContact` handles:
  - Phone & Email deduplication (normalizes and matches existing persons).
  - Merging tags (e.g. `['event-2026', 'volunteer']`).
  - Storing arbitrary/dynamic event questions inside the `customFields` JSON map.

## 3. Dynamic Fields Standard (`customFields`)
- DO NOT create generic slot columns like `textfield1`, `textfield2`.
- Store form-specific questions inside `customFields: Record<string, any>` with descriptive camelCase keys (e.g., `{ degree: "BSCS", tshirtSize: "XL", whyJoin: "..." }`).
- The Admin Contacts Hub (`/admin/contacts`) dynamically renders all keys in `customFields` automatically.

## 4. Email & Broadcast Integration
- Email Broadcaster (`/admin/email`) directly consumes contacts from the `contacts` collection.
- All email-eligible records should maintain `email` and `isSubscribedToEmail: boolean`.

