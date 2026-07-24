# Test Plan

## v1 Success Scenario
1. Open campaign page (e.g. `/campaigns/{seed-campaign-id}`) — no login required
2. Verify Data Source Setup section appears as 2nd section
3. Verify 11 signal rows render with default modes from seed data
4. Verify Review Platform, AI Brand Visibility, Social Currency show `◎ Proxied` and dropdown is disabled
5. Verify Media Spend dropdown has only Confirmed + Indexed (no Proxied)
6. Change SOV mode to Indexed → sub-panel shows direction dropdown + % input
7. Select direction: Higher, enter 12%
8. Click Save → toast/alert confirms saved
9. Verify SOV badge shows `↕ Indexed (85%)`
10. Refresh page → SOV still Indexed, Higher, 12%

## Empty State
1. Open campaign with no preferences row → all signals show default (unset) state
2. Prompt: "Set up data sources for this campaign"
3. Selecting a mode + Save creates the preferences row

## Error State
1. Disconnect network or stop API → click Save → error message shown, no silent failure
2. Retry button appears

## Validation Errors
1. Set Media Spend to Proxied → not available in dropdown (can't select)
2. Set Indexed mode but leave direction blank → Save blocked, field highlighted

## Loading State
1. Campaign page loads → preferences section shows skeleton rows while fetching
2. Rows populate when data arrives

## Mode Constraint Checks
1. Review Platform mode in DB is `proxied` → UI disables dropdown, shows locked icon
2. Media Spend dropdown has exactly 2 options