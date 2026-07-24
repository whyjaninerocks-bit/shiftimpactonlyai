# Test Plan

## v1 Success Scenario
1. Open app without login → see 3 seeded campaigns on the list page
2. Click "Summer Launch 2026" → campaign detail loads
3. Verify Campaign Info section shows name + client
4. Verify Data Source Configuration is the second section
5. Verify 11 signal rows render; 3 always-proxied rows show locked Proxied badge
6. Find SOV row — mode shows Proxied, weight shows ◎ 70%
7. Change SOV mode dropdown to Indexed
8. Verify sub-panel appears: direction dropdown + % input
9. Select direction "Higher", enter 15 in % input
10. Change Media Spend dropdown — verify Proxied is NOT an option
11. Type "Client confirmed directional SOV growth" in setup notes
12. Click Save → no error
13. Reload the page → SOV still shows Indexed, Higher, 15%, notes persist
14. Verify confidence weight now shows ↕ 85% for SOV

## Empty State
1. Create a new campaign (via SQL or a future create page) with no preferences row
2. Open its detail page → Data Source Configuration shows all 11 signals defaulting to Confirmed (✓ 100%)
3. 3 always-proxied signals still show Proxied regardless
4. Save → creates a preferences row in DB
5. Reload → preferences persist

## Error State
1. Stop the API server (or block the endpoint)
2. Open a campaign → Data Source Configuration shows inline error: "Could not load data preferences"
3. Retry button appears
4. Restore server → click Retry → preferences load

## Loading State
1. Slow network (throttle to Slow 3G)
2. Open campaign → skeleton rows appear in Data Source Configuration
3. Once loaded, skeleton replaced with actual rows

## Persistence Check
1. Make changes to 3 different signals on 2 different campaigns
2. Reload both → all changes persist
3. Open in a different browser → same state (server is truth, not localStorage)

## Constraint Check
1. Try setting Media Spend to Proxied via API (direct POST) → should be rejected by CHECK constraint
2. Try creating a second preferences row for the same campaign → should be rejected by UNIQUE constraint