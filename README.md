# Playwright E2E Automation Framework
End-to-end and event tests automation framework built with Playwright, designed using industry best practices such as Page Object Model (POM), feature-based test organization, and data-driven testing.

---

## Tech Stack
- Playwright
- JavaScript
- Faker (dynamic data generation)
- Page Object Model (POM)

---

## Project Structure
- tests/ 
-   auth/ 
-   events/ 
-   e2e/ 
- pages/ 
- test-data/
- utils/

---

## Features
- Dynamic test data using Faker
- Scalable Page Object Model structure
- Real-world test scenario (event creation & booking)
- UI validations and business logic assertions

---

## How to Run Tests
- "npm install"
- "npx playwright test"

---

## Example Test Flow
- Create event as admin
- Validate event appears in list
- Book ticket as user
- Validate booking confirmation and details
- Verify seat count decreases after booking

---

## Author
Jose Carlos Lozano