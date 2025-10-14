Feature: Add Transaction
  As a User
  I want to record a new income or expense
  So that my balance stays accurate and up to date

  Background:
    Given I am signed in
    And I am on the "Create Transaction" screen

  Scenario: Add an expense successfully (happy path)
    When I enter amount "25.00"
    And I select type "expense"
    And I enter note "lunch"
    And I tap "Save"
    Then I should see a success message
    And the Dashboard shows my updated balance
    And the most recent transaction is "expense" with amount "25.00"

  Scenario: Amount is invalid (unhappy path)
    When I enter amount "abc"
    And I select type "expense"
    And I tap "Save"
    Then I should see a validation error for "amount"
    And the transaction is not saved

  Scenario Outline: Create income with optional note (happy variants)
    When I enter amount "<amount>"
    And I select type "income"
    And I enter note "<note>"
    And I tap "Save"
    Then I should see a success message
    And the most recent transaction is "income" with amount "<amount>"

    Examples:
      | amount | note        |
      | 100.00 | salary      |
      | 50.00  | bonus       |
      | 10.00  | (empty)     |
