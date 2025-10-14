# Use Case: View Dashboard (CRUD – Read)

**Scope:** App  
**Level:** User goal  
**Primary Actor:** User

## Preconditions
- User is signed in.

## Postconditions
- Recent transactions and current balance displayed (newest first).

## Main Success Scenario (Happy Path)
1. User opens Dashboard.
2. System fetches transactions and computes current balance.
3. System shows balance and list (desc by time).
4. User optionally pull-to-refresh; System updates if data changed.

## Extensions (Unhappy Paths)
- 2a. **Fetch error (tbd)** → System shows non-blocking error + last known cached data (tbd).
- 3a. **No data** → System shows helpful empty state.

## Special Requirements
- Initial render < 2s (target).
- Accessible labels for screen readers (tbd).

## UML Activity Diagram
![Activity – View Dashboard](assets/view_dash_activity.png)

## Wireframe / Screenshot
![Wireframe – View Dashboard](assets/view_dash_wireframe.png)

## Narrative (Gherkin)
Linked: `features/view_dashboard.feature`
