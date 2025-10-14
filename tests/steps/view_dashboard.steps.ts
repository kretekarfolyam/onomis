import { Given, When, Then } from "@cucumber/cucumber";
import assert from "assert";

Given('I am on the "Dashboard" screen', function () {
  // TODO: navigate
});

When("the app loads my data", function () {
  // TODO: simulate fetch
});

Then("I should see the current balance", function () {
  // TODO: assert balance component visible
  assert.ok(true);
});

Then("I should see transactions sorted newest first", function () {
  // TODO: assert order by timestamp desc
  assert.ok(true);
});

When("I pull to refresh on Dashboard", function () {
  // TODO: simulate refresh gesture / method
});

Then("the app fetches updated data", function () {
  // TODO: assert fetch called
  assert.ok(true);
});

When("the data service returns an error", function () {
  // TODO: stub error response
});

Then("I should see a non-blocking error message", function () {
  // TODO: assert error UI
  assert.ok(true);
});

Then("I should see the last known cached data", function () {
  // TODO: verify cache
  assert.ok(true);
});
