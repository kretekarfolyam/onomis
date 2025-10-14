Feature: View Dashboard
  As a User
  I want to see my current balance and recent transactions
  So that I can track my spending and income

  Background:
    Given I am signed in
    And I am on the "Dashboard" screen

  Scenario: Dashboard shows balance and latest transactions (happy path)
    When the app loads my data
    Then I should see the current balance
    And I should see transactions sorted newest first

  Scenario: Pull-to-refresh updates data (happy path)
    When I pull to refresh on Dashboard
    Then the app fetches updated data
    And the list reflects any new transactions

  Scenario: Data fetch fails (unhappy path)
    When the data service returns an error
    Then I should see a non-blocking error message
    And I should see the last known cached data
