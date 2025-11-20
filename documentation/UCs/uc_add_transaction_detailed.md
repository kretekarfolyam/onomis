# Use Case: Add Transaction

**Primary Actor:** User

---

## 1. Assumptions

- The user has a stable internet connection for data synchronization with Firebase.
- The user has at least one wallet created in the system.
- The environment provides access to the device's camera or photo library for receipt image capture.
- The user understands the difference between income and expense transaction types.
- The Cloudinary service is available and operational for image storage.
- Firebase Firestore is accessible and properly configured.
- The system's date picker functionality is compatible with the user's device (iOS or Android).

---

## 2. Pre-conditions

- The actor is authenticated and logged into the application.
- The system has loaded the user's wallet list from Firebase.
- At least one active wallet exists for the authenticated user.
- The user has navigated to the dashboard or transaction screen.
- The transaction modal/screen is accessible from the current view.
- The system has loaded expense categories data.
- Network connectivity is available for data persistence.

---

## 3. Initiation

**Who starts it:** User

**Initial action:** The user taps the "Add Transaction" button or icon from the dashboard or wallet screen, which triggers the opening of the transaction modal/screen where the transaction form is displayed.

---

## 4. Process / Dialog

### Main Flow

1. User opens the Add Transaction modal/screen.

2. The system displays a form with the following fields:
   - Transaction Type dropdown (defaulted to "expense")
   - Wallet selector dropdown
   - Expense Category dropdown (conditional)
   - Date picker (defaulted to current date)
   - Amount input field
   - Description text area (optional)
   - Receipt image upload (optional)

3. User selects a transaction type (either "income" or "expense") from the Type dropdown.

4. The system dynamically shows or hides the Expense Category field based on selection:
   - If "expense" is selected, the Category field is displayed as required
   - If "income" is selected, the Category field is hidden

5. User selects a wallet from the Wallet dropdown, which displays wallet names with their current balances (e.g., "Cash ($1,250)").

6. If transaction type is "expense", user selects an expense category from the Category dropdown (e.g., Food, Transportation, Entertainment, etc.).

7. User taps the Date field and selects a transaction date using the native date picker:
   - On Android: Calendar picker appears
   - On iOS: Spinner-style picker appears with an "OK" button

8. The system updates the date field with the selected date in localized format.

9. User enters the transaction amount in the Amount field (numeric keyboard).

10. The system validates the amount input, allowing only numeric characters.

11. User optionally enters a description in the Description text area.

12. User optionally uploads a receipt image by:
    - Tapping the "Upload Image" button
    - Selecting an image from device gallery or taking a photo
    - The system displays a preview of the selected image

13. User taps the "Add Transaction" button to submit the form.

14. The system validates all required fields:
    - Wallet is selected
    - Date is set
    - Amount is greater than zero
    - Category is selected (if transaction type is "expense")

15. For expense transactions, the system checks if the selected wallet has sufficient balance to cover the expense amount.

16. If an image was uploaded, the system uploads it to Cloudinary in the "transactions" folder.

17. The system creates a timestamp and prepares the transaction data with user ID and wallet ID.

18. The system saves the transaction to Firebase Firestore.

19. The system updates the selected wallet's balance and totals:
    - For income: Increases wallet amount and totalIncome
    - For expense: Decreases wallet amount and increases totalExpenses

20. The system displays a success confirmation.

21. The system closes the transaction modal and returns the user to the previous screen (dashboard or wallet view).

22. The system refreshes the transaction list to display the newly added transaction.

23. The system updates the dashboard to reflect the new wallet balance.

### Alternative Flows

**A1: Missing Required Fields**
- At step 14, if any required field is empty (wallet, date, amount, or category for expenses):
  - The system displays an alert: "Please fill all the fields"
  - The user remains on the transaction form
  - The user corrects the missing information and continues from step 13

**A2: Insufficient Wallet Balance for Expense**
- At step 15, if the expense amount exceeds the selected wallet's current balance:
  - The system displays an alert: "Selected wallet don't have enough balance"
  - The user remains on the transaction form
  - The user can either reduce the amount, select a different wallet, or cancel the transaction

**A3: Image Upload Failure**
- At step 16, if the image upload to Cloudinary fails:
  - The system returns an error message: "Failed to upload image"
  - The system displays an alert with the error message
  - The transaction is not saved
  - The user can retry the upload with a different image or remove the image and continue

**A4: Network/Storage Error**
- At steps 18-19, if there is a network error or Firebase operation fails:
  - The system catches the exception
  - The system displays an alert: "Transaction" with the specific error message
  - The transaction is not saved
  - The wallet balance remains unchanged
  - The user can retry the operation or cancel

**A5: User Cancels Transaction**
- At any point before step 13, if the user taps the back button:
  - The system discards all entered data
  - The system closes the transaction modal
  - The user returns to the previous screen
  - No data is persisted

**A6: Invalid Amount Entry**
- At step 10, if the user attempts to enter non-numeric characters:
  - The system automatically filters out invalid characters
  - Only numeric values are accepted in the amount field
  - The user continues entering the valid amount

**A7: Date Picker Interaction (iOS-specific)**
- At step 7 on iOS devices:
  - The date picker remains open until the user taps "OK"
  - The user can scroll through dates using the spinner interface
  - Tapping "OK" confirms the selection and closes the picker

---

## 5. Termination

### Normal Ending Condition

The use case terminates successfully when:
- The transaction is persisted in Firebase Firestore with a unique transaction ID
- The selected wallet's balance and totals are updated in the database
- The success confirmation is acknowledged (implicitly by dismissing the modal)
- The user is returned to the dashboard or wallet screen
- The transaction list displays the newly added transaction
- The wallet balance reflects the change immediately

### Exceptional Ending

The use case terminates exceptionally when:
- **Validation Failure**: Required fields are missing, and the user chooses to cancel instead of completing the form
- **Insufficient Balance**: The user attempts to record an expense exceeding the wallet balance and decides to cancel
- **Network Failure**: A persistent network error prevents transaction creation, and the user gives up after retrying
- **Image Upload Failure**: The receipt image cannot be uploaded, and the user cancels instead of proceeding without it
- **User Cancellation**: The user explicitly cancels the operation by pressing the back button before submission

---

## 6. Post-conditions

### Upon Successful Completion

- **Transaction Data Storage**: The system stores the transaction document in Firebase Firestore with all provided data:
  - Transaction type (income/expense)
  - Amount
  - Category (for expenses)
  - Date (as Firestore Timestamp)
  - Description (if provided)
  - Receipt image URL from Cloudinary (if uploaded)
  - Associated wallet ID
  - User ID
  - Unique transaction ID

- **Wallet State Update**: The state of the associated wallet is updated:
  - `amount` field reflects the new balance (increased for income, decreased for expense)
  - `totalIncome` is incremented by the amount (for income transactions)
  - `totalExpenses` is incremented by the amount (for expense transactions)

- **User Interface Update**: The user sees:
  - The updated transaction list with the new transaction at the appropriate position (typically sorted by date)
  - The updated wallet balance on the dashboard
  - A visual confirmation that the operation succeeded (implicit through successful navigation)

- **Data Consistency**: Transaction and wallet data are synchronized across Firebase Firestore, ensuring data consistency for subsequent reads.

- **Audit Trail**: The transaction timestamp is permanently recorded for historical tracking and reporting purposes.

- **Image Persistence**: If a receipt image was uploaded, it is permanently stored in Cloudinary under the "transactions" folder with a unique identifier.

---

## Notes

- This use case can be extended for editing existing transactions by pre-populating the form with transaction data and performing update operations instead of create operations.
- The wallet balance validation for expenses is a critical business rule that prevents negative balances.
- The conditional display of the expense category field demonstrates adaptive form behavior based on user selection.
- Image upload is asynchronous and may add latency to the transaction creation process.
- The system maintains referential integrity between transactions and wallets through the `walletId` foreign key relationship.
