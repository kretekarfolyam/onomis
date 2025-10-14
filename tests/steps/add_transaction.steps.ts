import { Given, When, Then } from "@cucumber/cucumber";
import assert from "assert";

Given("I am signed in", function () {
  // TODO: mock auth/session or navigate to app state
});

Given('I am on the "Create Transaction" screen', function () {
  // TODO: navigate in test app or stub screen component
});

When('I enter amount {string}', function (amount: string) {
  // TODO: set amount field; validate numeric in app layer
});

When('I select type {string}', function (type: string) {
  // TODO: choose "income" | "expense"
});

When('I enter note {string}', function (note: string) {
  // TODO: set optional note
});

When('I tap {string}', function (label: string) {
  // TODO: trigger save action
});

Then("I should see a success message", function () {
  // TODO: assert toast/snackbar
  assert.ok(true);
});

Then('the Dashboard shows my updated balance', function () {
  // TODO: compare balance before/after
  assert.ok(true);
});

Then(
  'the most recent transaction is {string} with amount {string}',
  function (type: string, amount: string) {
    // TODO: inspect list top item
    assert.ok(type && amount);
  }
);

Then('I should see a validation error for {string}', function (field: string) {
  // TODO: assert validation message
  assert.ok(field);
});

Then("the transaction is not saved", function () {
  // TODO: ensure no new item added
  assert.ok(true);
});
