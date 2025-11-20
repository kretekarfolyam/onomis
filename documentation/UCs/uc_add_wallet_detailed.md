# Use Case: Add Wallet

**Primary Actor:** User

---

## 1. Assumptions

- The user has a stable internet connection for data synchronization with Firebase.
- The user understands the concept of wallets as separate accounts or financial containers for organizing transactions.
- The environment provides access to the device's photo library or camera for wallet icon upload.
- The Cloudinary service is available and operational for image storage.
- Firebase Firestore is accessible and properly configured.
- The user has sufficient storage quota on Cloudinary for image uploads.
- The user can distinguish between different wallets through names and optional icons.

---

## 2. Pre-conditions

- The actor is authenticated and logged into the application.
- The system has established a connection to Firebase Firestore.
- The user has navigated to the Wallet screen or tab.
- The wallet creation modal/screen is accessible from the current view.
- The user's Firebase authentication token is valid and active.
- Network connectivity is available for data persistence and image upload.
- The system has initialized the Cloudinary configuration for image uploads.

---

## 3. Initiation

**Who starts it:** User

**Initial action:** The user taps the "Add Wallet" or "New Wallet" button from the Wallet screen, which triggers the opening of the wallet creation modal where the wallet form is displayed.

---

## 4. Process / Dialog

### Main Flow

1. User opens the New Wallet modal/screen.

2. The system displays a form with the following fields:
   - Wallet Name input field (required)
   - Wallet Icon upload button (optional)

3. User enters a descriptive name for the wallet in the Wallet Name field (e.g., "Cash", "Savings Account", "Credit Card").

4. The system captures the input text in real-time as the user types.

5. User optionally taps the "Upload Image" button to add a custom wallet icon.

6. If the user chooses to upload an icon:
   - The system presents the device's image picker interface
   - User selects an image from the photo library or takes a new photo
   - The system displays a preview of the selected image in the form
   - The system shows a clear/remove button to allow image removal

7. User reviews the entered information (name and optional icon).

8. User taps the "Add Wallet" button to submit the form.

9. The system validates the required field:
   - Wallet Name must not be empty or contain only whitespace

10. The system initiates the wallet creation process and displays a loading indicator.

11. If an icon image was selected, the system uploads it to Cloudinary:
    - Image is uploaded to the "wallets" folder
    - The system receives the image URL from Cloudinary upon successful upload
    - The wallet data is updated with the image URL

12. The system prepares the wallet data object with:
    - Wallet name (trimmed of extra spaces)
    - Image URL (if uploaded) or null
    - User ID (from authenticated session)
    - Initial amount: 0
    - Initial totalIncome: 0
    - Initial totalExpenses: 0
    - Creation timestamp (current date/time)

13. The system generates a unique wallet ID from Firebase Firestore.

14. The system saves the wallet document to Firebase Firestore in the "wallets" collection.

15. The system receives confirmation of successful database write.

16. The system dismisses the loading indicator.

17. The system closes the wallet modal automatically.

18. The system returns the user to the Wallet screen.

19. The system refreshes the wallet list to display the newly created wallet.

20. The new wallet appears in the wallet list with its name, icon (if provided), and initial balance of $0.

### Alternative Flows

**A1: Empty Wallet Name**
- At step 9, if the wallet name field is empty or contains only whitespace:
  - The system displays an alert: "Please fill all the fields!"
  - The user remains on the wallet creation form
  - The user enters a valid wallet name and continues from step 8

**A2: Image Upload Failure**
- At step 11, if the image upload to Cloudinary fails due to network issues or service errors:
  - The system receives an error response from the image upload service
  - The system displays an alert with the error message: "Failed to upload image"
  - The wallet is not created
  - The user remains on the wallet creation form
  - The user can retry with a different image, proceed without an image by clearing the selection, or cancel the operation

**A3: Database Write Failure**
- At step 14, if the Firebase Firestore write operation fails:
  - The system catches the exception
  - The system displays an alert: "Wallet" with the specific error message
  - The wallet is not created
  - The user remains on the wallet creation form
  - The user can retry the operation or cancel

**A4: Network Connection Lost**
- At steps 11 or 14, if network connectivity is lost:
  - The system detects the network error
  - The system displays an appropriate error message
  - The operation is aborted
  - The user can retry when connectivity is restored or cancel the operation

**A5: User Cancels Wallet Creation**
- At any point before step 8, if the user taps the back button or close icon:
  - The system discards all entered data (name and selected image)
  - The system closes the wallet creation modal
  - The user returns to the Wallet screen
  - No data is persisted to the database

**A6: User Clears Selected Image**
- At step 6, after selecting an image, if the user taps the clear/remove button:
  - The system removes the image preview from the form
  - The image selection is reset to null
  - The user can proceed without an icon or select a different image
  - The user continues from step 7

**A7: Duplicate Wallet Name (Informational)**
- At step 9, the system does not validate for duplicate wallet names:
  - Multiple wallets with the same name are allowed
  - Users are responsible for creating distinguishable wallet names
  - The user continues the normal flow

---

## 5. Termination

### Normal Ending Condition

The use case terminates successfully when:
- The wallet is persisted in Firebase Firestore with a unique wallet ID
- The wallet icon (if uploaded) is stored in Cloudinary and its URL is saved with the wallet
- The wallet appears in the user's wallet list on the Wallet screen
- The user is returned to the Wallet screen with the modal closed
- The wallet list displays the newly created wallet with initial balance of $0
- The wallet is immediately available for transaction assignment

### Exceptional Ending

The use case terminates exceptionally when:
- **Validation Failure**: The wallet name is empty, and the user chooses to cancel instead of entering a valid name
- **Image Upload Failure**: The wallet icon cannot be uploaded to Cloudinary due to persistent errors, and the user decides to cancel rather than proceed without an icon
- **Network Failure**: A persistent network error prevents wallet creation, and the user gives up after retrying
- **Database Error**: Firebase Firestore operation fails due to permissions or service issues, and the user cancels the operation
- **User Cancellation**: The user explicitly cancels the operation by pressing the back button before submission

---

## 6. Post-conditions

### Upon Successful Completion

- **Wallet Data Storage**: The system stores the wallet document in Firebase Firestore with all initialized data:
  - Unique wallet ID (auto-generated by Firebase)
  - Wallet name (as entered by user)
  - Wallet icon URL from Cloudinary (if image was uploaded) or null
  - User ID (associated with the authenticated user)
  - `amount`: 0 (initial balance)
  - `totalIncome`: 0 (cumulative income tracker)
  - `totalExpenses`: 0 (cumulative expenses tracker)
  - `created`: Timestamp of wallet creation

- **Image Persistence**: If a wallet icon was uploaded:
  - The image is permanently stored in Cloudinary under the "wallets" folder
  - The image URL is accessible and retrievable for display in the UI
  - The image is associated with the wallet through the stored URL

- **Wallet Availability**: The state of the user's wallet collection is updated:
  - The new wallet is immediately available for selection in transaction forms
  - The wallet appears in dropdowns and wallet lists throughout the application
  - The wallet can be used for creating income and expense transactions

- **User Interface Update**: The user sees:
  - The updated wallet list with the new wallet displayed
  - The wallet name and icon (if provided) clearly visible
  - The initial balance of $0.00 shown for the new wallet
  - The wallet positioned according to the list sort order (typically by creation date, most recent first)

- **Data Consistency**: Wallet data is synchronized across Firebase Firestore, ensuring consistency for:
  - Transaction creation (wallet selection)
  - Wallet editing and deletion operations
  - Dashboard balance calculations
  - Statistical reporting and analysis

- **Referential Integrity**: The wallet is properly linked to the user account:
  - The `uid` field establishes ownership
  - Only the authenticated user can view and manage this wallet
  - The wallet will appear in queries filtered by user ID

---

## Notes

- This use case supports both create and update operations through the same modal interface. When editing an existing wallet, the form is pre-populated with current wallet data.
- Wallet names are not validated for uniqueness, allowing users to have multiple wallets with the same name if desired (though not recommended).
- The initial balance is always set to 0 for new wallets. Balance changes occur only through transaction creation.
- Deleting a wallet will cascade delete all associated transactions (as implemented in the `deleteWallet` service function).
- The wallet icon is optional but recommended for better visual organization and quick wallet identification.
- Image upload adds latency to the wallet creation process, typically 1-3 seconds depending on network conditions and image size.
- The system maintains a cumulative tracking of income and expenses separately (`totalIncome` and `totalExpenses`), which is useful for analytics and reporting.
