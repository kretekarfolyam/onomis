# Use Case: Add Profile Picture

**Primary Actor:** User

---

## 1. Assumptions

- The user has access to the device's photo library or camera for image selection.
- The user understands the purpose of a profile picture for personalization and identification.
- The environment provides necessary permissions for accessing the device's media library.
- The Cloudinary service is available and operational for image storage.
- Firebase Firestore is accessible and properly configured for user data updates.
- The user has sufficient storage quota on Cloudinary for image uploads.
- The device has adequate storage space for caching selected images.
- Image quality reduction to 50% is acceptable for the user's needs.

---

## 2. Pre-conditions

- The actor is authenticated and logged into the application.
- The system has loaded the user's current profile data from Firebase Firestore.
- The user has navigated to the Profile tab/screen.
- The "Edit Profile" or profile picture edit functionality is accessible.
- The system has established a connection to Firebase Firestore.
- Network connectivity is available for image upload and data persistence.
- The user's Firebase authentication token is valid and active.
- The Expo ImagePicker module is properly configured and has necessary permissions.

---

## 3. Initiation

**Who starts it:** User

**Initial action:** The user taps the "Edit Profile" option from the Profile screen or taps the pencil/edit icon overlay on their current profile picture, which opens the Update Profile modal where they can modify their profile picture.

---

## 4. Process / Dialog

### Main Flow

1. User navigates to the Profile screen where their current profile information is displayed.

2. The system displays the user's current profile picture (or a default placeholder if no picture exists) along with their name and email.

3. User taps the "Edit Profile" option from the account options menu.

4. The system opens the Update Profile modal displaying:
   - Current profile picture with an edit icon overlay
   - Name input field (pre-filled with current name)
   - Update button at the bottom

5. User taps the pencil/edit icon overlaid on the profile picture.

6. The system launches the device's native image picker interface using Expo ImagePicker.

7. The system requests media library permissions if not already granted (iOS/Android-specific permission dialogs).

8. The image picker displays the user's photo library with available images.

9. User browses through their photo library and selects an image.

10. The system processes the selected image with the following parameters:
    - Media type: Images only
    - Aspect ratio: 4:3
    - Quality: 0.5 (50% compression for optimization)

11. The system displays a preview of the selected image in the profile picture area within the modal.

12. The user reviews the selected profile picture and name information.

13. User taps the "Update" button to save changes.

14. The system validates the required fields:
    - Name must not be empty or contain only whitespace
    - Profile picture must be selected (image data present)

15. The system displays a loading indicator and disables the Update button.

16. The system checks if the image has a URI (indicating a new image selection).

17. The system uploads the image to Cloudinary:
    - Image is uploaded to the "users" folder
    - Image is compressed according to quality settings
    - The system receives the image URL from Cloudinary upon successful upload

18. The system prepares the updated user data object with:
    - Name (trimmed of extra spaces)
    - Image URL (from Cloudinary)

19. The system updates the user document in Firebase Firestore at `users/{uid}` with the new data.

20. The system receives confirmation of successful database update.

21. The system calls `updateUserData` to refresh the user's profile data in the authentication context.

22. The system fetches the updated user document from Firestore.

23. The system updates the global user state in the AuthContext with the new profile picture URL.

24. The system dismisses the loading indicator.

25. The system closes the Update Profile modal automatically.

26. The system returns the user to the Profile screen.

27. The user sees their updated profile picture immediately reflected on the Profile screen.

28. The updated profile picture is available throughout the application (e.g., in headers, navigation bars).

### Alternative Flows

**A1: Missing Required Fields**
- At step 14, if the name is empty or the profile picture is not selected:
  - The system displays an alert: "Please fill all the fields!"
  - The user remains on the Update Profile modal
  - The user must provide both name and profile picture to continue
  - The user can either complete the required fields or cancel the operation

**A2: User Cancels Image Selection**
- At step 9, if the user cancels the image picker without selecting an image:
  - The system receives a canceled result from the ImagePicker
  - The profile picture preview remains unchanged (shows previous image or placeholder)
  - The user remains on the Update Profile modal
  - The user can retry image selection, proceed with the existing image, or cancel the entire operation

**A3: Media Library Permissions Denied**
- At step 7, if the user denies media library access permissions:
  - The system cannot launch the image picker
  - The system may display a message indicating that permissions are required
  - The user cannot select a new profile picture
  - The user must grant permissions in device settings to proceed or cancel the operation

**A4: Image Upload Failure**
- At step 17, if the Cloudinary upload fails due to network issues or service errors:
  - The system receives an error response from the upload service
  - The system dismisses the loading indicator
  - The system displays an alert: "User" with message "Failed to upload image"
  - The profile data is not updated in Firestore
  - The user remains on the Update Profile modal
  - The user can retry the upload or cancel the operation

**A5: Database Update Failure**
- At step 19, if the Firebase Firestore update operation fails:
  - The system catches the exception
  - The system dismisses the loading indicator
  - The system displays an alert: "User" with the specific error message
  - The user data is not updated
  - The user remains on the Update Profile modal
  - The user can retry the operation or cancel

**A6: Network Connection Lost**
- At steps 17 or 19, if network connectivity is lost during upload or database update:
  - The system detects the network error
  - The system dismisses the loading indicator
  - The system displays an appropriate error message
  - The operation is aborted
  - The user can retry when connectivity is restored or cancel the operation

**A7: User Cancels Profile Update**
- At any point before step 13, if the user taps the back button:
  - The system discards all changes (new image selection)
  - The system closes the Update Profile modal
  - The user returns to the Profile screen
  - The profile picture remains unchanged
  - No data is persisted to the database

**A8: Image Too Large or Unsupported Format**
- At step 10, if the selected image cannot be processed:
  - The system may fail to process the image
  - An error may be caught during image preparation
  - The user is notified of the issue
  - The user can select a different image or cancel

**A9: Updating Without Changing Profile Picture**
- At step 16, if the user updates only the name without selecting a new image:
  - The system checks if the image has a URI
  - Since no new image is selected, the image upload step (step 17) is skipped
  - The system proceeds with updating only the name field
  - The existing profile picture URL remains unchanged in the database

---

## 5. Termination

### Normal Ending Condition

The use case terminates successfully when:
- The new profile picture is uploaded to Cloudinary and its URL is obtained
- The user's profile data (name and image URL) is updated in Firebase Firestore
- The global user state in AuthContext is refreshed with the new profile picture
- The Update Profile modal is closed
- The user is returned to the Profile screen
- The new profile picture is immediately visible on the Profile screen
- The profile picture is synchronized across all application screens where it appears

### Exceptional Ending

The use case terminates exceptionally when:
- **Validation Failure**: Required fields are missing (name or image), and the user chooses to cancel instead of completing the form
- **Permission Denial**: The user denies media library permissions, preventing image selection, and decides to cancel
- **Image Upload Failure**: The profile picture cannot be uploaded to Cloudinary due to persistent errors, and the user gives up after retrying
- **Network Failure**: A persistent network error prevents image upload or database update, and the user abandons the operation
- **Database Error**: Firebase Firestore update operation fails due to permissions or service issues, and the user cancels the operation
- **User Cancellation**: The user explicitly cancels the operation by pressing the back button before submission

---

## 6. Post-conditions

### Upon Successful Completion

- **User Profile Data Update**: The system stores the updated user data in Firebase Firestore:
  - `image`: URL of the profile picture stored in Cloudinary
  - `name`: User's name (may or may not be changed)
  - Document location: `users/{uid}` where uid is the user's unique identifier

- **Image Persistence**: The profile picture is permanently stored:
  - Stored in Cloudinary under the "users" folder
  - Image is compressed to 50% quality for optimization
  - Aspect ratio maintained at 4:3
  - Unique URL generated and retrievable for display

- **Global State Update**: The state of the user object in AuthContext is updated:
  - `user.image` property contains the new Cloudinary URL
  - The updated user data is accessible throughout the application
  - All components consuming the AuthContext receive the updated user information

- **User Interface Update**: The user sees:
  - The new profile picture displayed prominently on the Profile screen
  - The updated profile picture in the circular avatar with proper styling
  - The profile picture reflected in any navigation headers or app bars
  - Consistent display of the new profile picture across all screens

- **Data Consistency**: Profile picture data is synchronized:
  - Firestore database contains the latest image URL
  - AuthContext global state matches the database state
  - All UI components display the same profile picture
  - No stale or cached old profile pictures remain visible

- **Cache and Display**: The system ensures:
  - The new profile picture is cached locally for quick loading
  - The image is displayed with proper content fit ("cover" mode)
  - Smooth transition animation (100ms) is applied when loading the image
  - Circular border styling (border radius 200) is maintained

- **Audit Trail**: The profile update is timestamped:
  - Firebase Firestore automatically tracks the last update time
  - The change can be audited through Firebase console
  - The Cloudinary upload includes metadata about upload time

---

## Notes

- This use case is part of a larger "Update Profile" workflow that also allows name changes, but the focus here is specifically on adding/updating the profile picture.
- The profile picture is optional during registration but becomes required when explicitly updating through the Edit Profile modal (both name and image must be present).
- Image compression to 50% quality helps optimize storage costs and loading performance while maintaining acceptable visual quality.
- The circular display of profile pictures (border radius 200) is consistent throughout the application UI.
- The edit icon overlay provides clear affordance that the profile picture is editable.
- If a user already has a profile picture, this use case effectively becomes "Update Profile Picture" rather than "Add Profile Picture," but the process flow remains identical.
- The system uses Expo's Image component rather than React Native's native Image component for better performance and caching.
- Profile pictures are displayed with a fallback mechanism through the `getProfileImage` utility function, which provides a default avatar if no image is available.
- The AuthContext acts as the single source of truth for user data, ensuring consistency across the application when profile pictures are updated.
