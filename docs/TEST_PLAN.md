# Test Plan

## v1 Success Scenario
1. Open homepage → see 4 seeded campaigns rendered (no login required)
2. Click a campaign → land on campaign detail page
3. Verify 11 signal rows visible, each with mode dropdown
4. Verify Review Platform, AI Brand Visibility, Social Currency show Proxied (locked, dropdown disabled)
5. Verify Media Spend dropdown has no Proxied option
6. Find SOV row → change mode to Indexed → sub-panel shows direction dropdown + % input
7. Select direction 'Higher' → enter 15 in % input
8. Verify mode badge shows ↕Index (85%)
9. Find Branded Search → change to Confirmed → sub-panel shows link-to-source text input
10. Enter 'https://search.google.com/console' → verify badge shows ✓Conf (100%)
11. Click Save → toast/notification confirms save
12. Reload page → all changes persist (SOV Indexed/Higher/15%, Branded Search Confirmed)
13. Verify adjusted score displays: SOV = 100 × 0.85 = 85, Branded Search = 100 × 1.0 = 100

## Empty State
1. Open a campaign with no saved preferences → all 11 signals default to Proxied
2. Each signal shows read-only proxy source name
3. Save button creates new preferences row (upsert from empty)

## Error State
1. Disconnect network → click Save → error message shown, no silent failure
2. GET fails → skeleton rows render, retry button visible
3. Invalid input: enter 150 in % field → validation error (must be 0-100)

## Persistence Check
1. Save preferences for campaign A
2. Navigate to campaign B (no prefs) → see all defaults
3. Navigate back to campaign A → see saved preferences
4. Confirm DB has one row per campaign (unique constraint)