import { test, expect, Page } from '@playwright/test';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// Define the type for the test data
interface TestData {
  role: string;
  seniorty: string;
  country: string;
  currency: string;
}

async function fetchTestData(): Promise<TestData[]> {
  const baseUrl = 'https://70f83e46-1117-4e4c-8e02-a89fb76752a1.mock.pstmn.io'
  const response = await axios.get(`${baseUrl}/test-data/salary-insights-data`);
  return response.data;
}

// Utility function to create screenshot directory
function ensureScreenshotDirectory(testName: string) {
  const screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots', testName);
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  return screenshotDir;
}

// Enhanced screenshot capturing function
async function captureScreenshots(
  page: Page, 
  screenshotDir: string, 
  testData: TestData, 
  stage: string
) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const baseFileName = `${testData.role}_${testData.seniorty}_${testData.country}_${stage}_${timestamp}`;

  try {
    // Full page screenshot
    await page.screenshot({ 
      path: path.join(screenshotDir, `${baseFileName}_full.png`),
      fullPage: true 
    });

    // Iframe screenshot
    const iframe = page.locator('#idIframe').contentFrame();
    if (iframe) {
      await iframe.screenshot({
        path: path.join(screenshotDir, `${baseFileName}_iframe.png`)
      });
    }

    // Specific element screenshots
    const elementScreenshots = [
      { selector: 'role-selector', locator: page.locator('#idIframe').contentFrame().getByPlaceholder('Select a Role *') },
      { selector: 'country-selector', locator: page.locator('#idIframe').contentFrame().getByPlaceholder('Country *') },
      { selector: 'search-button', locator: page.locator('#idIframe').contentFrame().getByRole('button', { name: 'Search', exact: true }) }
    ];

    for (const elem of elementScreenshots) {
      try {
        await elem.locator.screenshot({
          path: path.join(screenshotDir, `${baseFileName}_${elem.selector}.png`)
        });
      } catch (elementScreenshotError) {
        console.warn(`Could not capture screenshot for ${elem.selector}:`, elementScreenshotError);
      }
    }
  } catch (screenshotError) {
    console.error('Screenshot capture failed:', screenshotError);
  }
}

test.describe('Dynamic Salary Insights Tests', () => {
  let testData: TestData[];
  const screenshotDir = ensureScreenshotDirectory('salary-insights');

  test.beforeAll(async () => {
    testData = await fetchTestData();
    console.log('Loaded Test Data:', testData);
  });

  test('Run dynamic tests for all roles', async ({ page, context }) => {
    // Configure browser context for consistent testing
    await context.setDefaultTimeout(30000);

    for (const testCase of testData) {
      await test.step(`Test for ${testCase.role} in ${testCase.seniorty} (${testCase.country})`, async () => {
        try {
          // Navigate to page
          await page.goto("https://www.deel.com/pt/salary-insights");
          await page.waitForLoadState("load");

          // Capture initial page screenshot
          await captureScreenshots(page, screenshotDir, testCase, 'initial');

          const iframe = page.locator('#idIframe').contentFrame();

          // Select Role
          await iframe.getByPlaceholder('Select a Role *').fill(testCase.role);
          await iframe.getByRole('combobox', { name: 'role' }).click();

          // Select Level
          await iframe.getByRole('combobox', { name: 'Seniorty Level *' }).fill(testCase.seniorty);
          await iframe.getByRole('listbox', { name: 'Seniorty Level *' }).click();

          // Select Country
          await iframe.getByPlaceholder('Country *').fill(testCase.country);
          await iframe.getByRole('listbox', { name: 'Country *' }).locator('div').nth(3).click();

          // Select Currency
          await iframe.getByRole('combobox', { name: 'Currency' }).fill(testCase.currency);
          await iframe.getByRole('listbox', { name: 'Currency' }).locator('div').nth(1).click();

          // Capture pre-search screenshot
          await captureScreenshots(page, screenshotDir, testCase, 'pre-search');

          // Click Search
          await iframe.getByRole('button', { name: 'Search', exact: true }).click();

          // Wait for results and capture post-search screenshot
          await page.waitForTimeout(3000);
          await captureScreenshots(page, screenshotDir, testCase, 'post-search');

          // Add your assertions here
          // Example: 
          // const resultLocator = page.locator('result-selector');
          // await expect(resultLocator).toBeVisible();

        } catch (error) {
          console.error(`Test failed for ${testCase.role} in ${testCase.country}:`, error);
          
          // Capture error state screenshot
          await captureScreenshots(page, screenshotDir, testCase, 'error');
          
          // Rethrow to mark test as failed
          throw error;
        }
      });
    }
  });
});

export {};

/*
import { test, expect, } from '@playwright/test';
// import * as fs from 'fs';
// import * as path from 'path';
import axios from 'axios';

// Define the type for the test data
interface TestData {
  role: string;
  seniorty: string;
  country: string;
  currency: string;

}

async function fetchTestData(): Promise<TestData[]> {
  const baseUrl = 'https://70f83e46-1117-4e4c-8e02-a89fb76752a1.mock.pstmn.io'
  const response = await axios.get(`${baseUrl}/test-data/salary-insights-data`);
  return response.data;
}

test.describe('Dynamic Salary Insights Tests', () => {
  let testData: TestData[];

  test.beforeAll(async () => {
    testData = await fetchTestData();
    console.log(testData);

  });

  test('Run dynamic tests for all roles', async ({ page }) => {
    for (const { role, seniorty, country, currency } of testData) {

      await test.step(`Should display correct compensation info for ${role} in ${seniorty} in ${country} in ${currency}`, async () => {
        await page.goto("https://www.deel.com/pt/salary-insights");
        await page.waitForLoadState("load");

        // Select Role
        await page.waitForTimeout(3000); // Waits for 3 seconds
        await page.locator('#idIframe').contentFrame().getByPlaceholder('Select a Role *').fill(role);
      await page.locator('#idIframe').contentFrame().getByRole('combobox', { name: 'role' }).click();


        // Select Level

        await page.locator('#idIframe').contentFrame().getByRole('combobox', { name: 'Seniorty Level *' }).fill(seniorty);
        await page.locator('#idIframe').contentFrame().getByRole('listbox', { name: 'Seniorty Level *' }).click();


        // Select Country   

        await page.locator('#idIframe').contentFrame().getByPlaceholder('Country *').fill(country);
        await page.locator('#idIframe').contentFrame().getByRole('listbox', { name: 'Country *' }).locator('div').nth(3).click();

        // Select Currency

        await page.locator('#idIframe').contentFrame().getByRole('combobox', { name: 'Currency' }).fill(currency);
        await page.locator('#idIframe').contentFrame().getByRole('listbox', { name: 'Currency' }).locator('div').nth(1).click();
        // getByText('United States').click();

        // Click Search
        await page.locator('#idIframe').contentFrame().getByRole('button', { name: 'Search', exact: true }).click();

      });
    }
  });
});
*/
/*
// Load test data from JSON file
const testDataPath = path.resolve(__dirname, 'data', './salary_insights.json');
let salaryTestData: TestData[];

try {
  const rawData = fs.readFileSync(testDataPath, "utf8");
  salaryTestData = JSON.parse(rawData) as TestData[];
} catch (error) {
  console.error("Error reading or parsing salary_insights.json:", error);
  process.exit(1); // Exit the process with an error code
}


test.describe('Salary Insights Tests Naive', () => {
    salaryTestData.forEach(({ role, seniorty, country, currency }) => {
    // salaryTestData.forEach((data) => {
        test(`Should display correct compensation info for ${role} in ${seniorty} in ${country} in ${currency}`, async ({ page }) => {
            await page.goto("https://www.deel.com/pt/salary-insights");

            // Select Role

            await page.locator('#idIframe').contentFrame().getByPlaceholder('Select a Role *').fill(role);
            await page.locator('#idIframe').contentFrame().getByRole('listbox', { name: 'Role *' }).click();

            // Select Level

            // await page.locator('#idIframe').contentFrame().getByLabel('Seniorty Level *').click();
            await page.locator('#idIframe').contentFrame().getByRole('combobox', { name: 'Seniorty Level *' }).fill(seniorty);
            await page.locator('#idIframe').contentFrame().getByRole('listbox', { name: 'Seniorty Level *' }).click();

            
            // Select Country   

            await page.locator('#idIframe').contentFrame().getByPlaceholder('Country *').fill(country);
            await page.locator('#idIframe').contentFrame().getByRole('listbox', { name: 'Country *' }).locator('div').nth(3).click();

            // Select Currency

            await page.locator('#idIframe').contentFrame().getByRole('combobox', { name: 'Currency' }).fill(currency);
            await page.locator('#idIframe').contentFrame().getByRole('listbox', { name: 'Currency' }).locator('div').nth(1).click();
            // getByText('United States').click();

            // Click Search
            await page.locator('#idIframe').contentFrame().getByRole('button', { name: 'Search', exact: true }).click();

        });
        

    });

});
*/

