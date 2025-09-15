# Data-Driven-Tests-With-Playwright

This project demonstrates data-driven testing with Playwright, automating Deel's Salary Insights tool across multiple browsers.

Project Structure

├── playwright.config.ts      # Playwright configuration
├── package.json              # Project dependencies
├── tests/
│   ├── salary-insights_pre_data_driven.spec.ts  # Main test file
│   └── data/
│       └── salary_insights.json                 # Test data

Test Data
The tests use a data-driven approach with entries from salary_insights.json:

[
    { "role": "QA Engineer", "seniorty": "Senior", "country": "Canada", "currency": "USD" },
    { "role": "QA Engineer", "seniorty": "Junior", "country": "Brazil", "currency": "USD" },
    { "role": "Devops Engineer", "seniorty": "Middle", "country": "United States", "currency": "USD" },
    { "role": "Devops Engineer", "seniorty": "Senior", "country": "United Kingdom", "currency": "USD" }
]

# Install dependencies
npm install

# Install browser binaries
npx playwright install

# Run tests in all browsers (Chromium, Firefox, WebKit)
npx playwright test

# Run tests in a specific browser
npx playwright test --project=chromium

# Run tests in headed mode
npx playwright test --headed

# View HTML report after test run
npx playwright show-report

How It Works
The test suite:

Reads test data from salary_insights.json
Creates a test for each data entry
Navigates to Deel's Salary Insights page
Interacts with form elements inside an iframe:
Selects "For one role and country"
Fills in role, seniority level, country, and currency
Submits the form and waits for results
Each test uses a desktop viewport (940x1080) and generates a descriptive title based on the test data.

Key Features
Data-driven testing: Parameterized tests from external JSON data
Cross-browser testing: Tests run on Chromium, Firefox, and WebKit
iframe handling: Demonstrates working with elements inside iframes
Dynamic test titles: Clear test identification based on data parameters
Configuration
The Playwright config sets:

Global timeout: 80 seconds
Action timeout: 10 seconds
Navigation timeout: 30 seconds
Default viewport: 320x1080 (mobile), overridden to 940x1080 in tests
HTML reporter
Potential Improvements
Replace hard-coded timeouts with explicit waiting conditions
Add scripts to package.json for easier test execution
Store the iframe reference to reduce redundant code
Add assertions to verify correct results display