# Use Case: Add Transaction (CRUD – Create)

**Scope:** App  
**Level:** User goal  
**Primary Actor:** User  
**Stakeholders & Interests:** User (wants quick, accurate entry and updated balance)

## Preconditions
- User is signed in.
- App is on Create Transaction screen.

## Postconditions
- Transaction is persisted.
- Dashboard balance reflects the new transaction.

## Main Success Scenario (Happy Path)
1. User opens Create Transaction.
2. System prompts for Amount, Type (income/expense), optional Note.
3. User enters valid Amount and selects Type.
4. User confirms Save.
5. System timestamps, stores the transaction, and recalculates balance.
6. System shows success and returns to Dashboard with updated list.

## Extensions (Unhappy Paths)
- 3a. **Invalid amount** → System shows validation error; User corrects and continues.
- 4a. **Network/storage error (tbd)** → System shows error; User may retry or cancel.

## Special Requirements
- Input validation with clear error messages.
- Save action < 1.5s on typical network (tbd backend).

## Frequency of Use
- Multiple times per day (tbd).

## UML Activity Diagram
![Activity – Add Transaction](assets/add_tx_activity.png)

## Wireframe / Screenshot
![Wireframe – Add Transaction](assets/add_tx_wireframe.png)

## Narrative (Gherkin)
Linked: `features/add_transaction.feature`
