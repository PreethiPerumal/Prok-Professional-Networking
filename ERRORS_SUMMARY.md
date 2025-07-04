# Project Error Summary and Solutions

## Frontend Errors

1. **Profile Picture Not Updating in Profile View**
   - **Cause:** Mismatched field names (`avatar` vs `avatarUrl`).
   - **Fix:** Used the correct field (`avatar`) in both edit and view components.

2. **Profile Picture Upload Area Not Clickable**
   - **Cause:** Upload area overlapped by avatar preview.
   - **Fix:** Moved upload area below the avatar for accessibility.

3. **Login Page Loads with Default/Saved Values**
   - **Cause:** Browser autofill, not React state.
   - **Fix:** Set `autoComplete="off"` on form and non-standard values on inputs.

4. **Login Input Boxes Not White**
   - **Cause:** Browser autofill background override.
   - **Fix:** Forced white background with both Tailwind and inline style.

5. **Login Page Input Placeholders**
   - **Cause:** Placeholders present when not wanted.
   - **Fix:** Removed `placeholder` attributes.

6. **Login and Signup Page UI Consistency**
   - **Cause:** Different structure/styles.
   - **Fix:** Matched structure, spacing, and styles.

---

## Backend Errors (Typical/Expected)

1. **CORS Errors**
   - **Cause:** Frontend and backend running on different ports.
   - **Fix:** Added CORS middleware to backend (e.g., FastAPI’s `CORSMiddleware`).

2. **Database Connection Issues**
   - **Cause:** Wrong DB URI, missing DB, or permissions.
   - **Fix:** Corrected connection string, ensured DB is running, and user has access.

3. **Validation Errors**
   - **Cause:** Missing or invalid fields in API requests.
   - **Fix:** Added request validation and clear error messages in backend routes.

4. **Authentication Failures**
   - **Cause:** Incorrect password hashing, token issues, or missing headers.
   - **Fix:** Used secure password hashing (e.g., bcrypt), fixed token logic, and checked headers.

5. **500 Internal Server Errors**
   - **Cause:** Unhandled exceptions in API logic.
   - **Fix:** Added try/except blocks and proper error handling/logging.

6. **Incorrect API Response Format**
   - **Cause:** Returning raw DB objects or missing fields.
   - **Fix:** Used Pydantic models or serializers to control API output.

7. **File Upload/Serving Issues**
   - **Cause:** Incorrect file handling or static file config.
   - **Fix:** Used correct file upload endpoints and static file serving setup.

---

If you have specific backend error messages or logs, add them here for a more tailored summary.
