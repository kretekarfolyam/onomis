Feature: Add Wallet
  As a user
  I want to create a new wallet
  So that I can organize my transactions by different accounts or purposes

  Background:
    Given the user is signed in
    And the user is on the Wallet screen

  Scenario: Successfully add a wallet with name only
    When the user opens the Create Wallet modal
    And the user enters "Cash" as the wallet name
    And the user confirms Add Wallet
    Then the wallet is created with initial balance of 0
    And the wallet appears in the wallet list
    And the user is returned to the Wallet screen
    And a success message is displayed

  Scenario: Successfully add a wallet with name and icon
    When the user opens the Create Wallet modal
    And the user enters "Savings Account" as the wallet name
    And the user uploads an icon image
    And the user confirms Add Wallet
    Then the icon is uploaded to cloud storage
    And the wallet is created with the uploaded icon
    And the wallet appears in the wallet list with the custom icon
    And the user is returned to the Wallet screen

  Scenario: Fail to add wallet with empty name
    When the user opens the Create Wallet modal
    And the user leaves the wallet name field empty
    And the user confirms Add Wallet
    Then the system displays an error "Please fill all the fields!"
    And the wallet is not created
    And the user remains on the Create Wallet modal

  Scenario: Handle image upload failure
    When the user opens the Create Wallet modal
    And the user enters "Credit Card" as the wallet name
    And the user attempts to upload an icon but the upload fails
    Then the system displays an error message about the upload failure
    And the user can retry the upload or proceed without an icon

  Scenario: Handle network error during wallet creation
    When the user opens the Create Wallet modal
    And the user enters "Investment Portfolio" as the wallet name
    And the user confirms Add Wallet
    But a network error occurs
    Then the system displays an error message
    And the wallet is not created
    And the user can retry or cancel the operation

  Scenario: Cancel wallet creation
    When the user opens the Create Wallet modal
    And the user enters "New Wallet" as the wallet name
    And the user cancels the operation
    Then the wallet is not created
    And the user is returned to the Wallet screen
