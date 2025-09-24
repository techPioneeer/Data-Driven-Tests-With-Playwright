import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';


let browser: import('playwright').Browser;
let context: import('playwright').BrowserContext;
let page: import('playwright').Page;

// Define the type for the test data
interface TestData {
    role: string;
    seniorty: string;
    country: string;
    currency: string;

}

// Load test data from JSON file
const testDataPath = path.resolve(__dirname, 'data', './salary_insights.json');
let salaryTestData

try {
  const rawData = fs.readFileSync(testDataPath, "utf8");
  salaryTestData = JSON.parse(rawData) as TestData[];
} catch (error) {
  console.error("Error reading or parsing salary_insights.json:", error);
  process.exit(1); // Exit the process with an error code
}

test.describe('Salary Insights Tests (shared browser)', () => {

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: true }); // set headless true if desired
    context = await browser.newContext({ viewport: { width: 940, height: 1080 } });
    page = await context.newPage();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  salaryTestData.forEach(({ role, seniorty, country, currency }) => {
    test(`Should display correct compensation info for ${role} / ${seniorty} / ${country} / ${currency}`, async () => {
      // use sharedPage instead of the fixture page
      await page.goto('https://www.deel.com/salary-insights/?utm_source=global-hiring-toolkit');
      await page.waitForLoadState('load');
     
      await page.waitForTimeout(15000);
            await page.locator('#idIframe').contentFrame().getByLabel('For one role and country').waitFor();
            await page.locator('#idIframe').contentFrame().getByLabel('For one role and country').check();
            


            // Select Role

            await page.locator('#idIframe').contentFrame().getByRole('combobox', { name: 'Role *' }).fill(role);
            await page.locator('#idIframe').contentFrame().getByRole('listbox', { name: 'Role *' }).click();

            // Select Seniority Level
            await page.locator('#idIframe').contentFrame().getByLabel('Seniority Level *').fill(seniorty);
            await page.locator('#idIframe').contentFrame().getByRole('listbox', { name: 'Seniority Level *' }).click();

            
            // Select Country   

            await page.locator('#idIframe').contentFrame().getByLabel('Country *').fill(country);
            await page.locator('#idIframe').contentFrame().getByRole('combobox', { name: 'Country *' }).click();

            // Select Currency
            await page.locator('#idIframe').contentFrame().getByLabel('Currency *').fill(currency);
            await page.locator('#idIframe').contentFrame().getByRole('combobox', { name: 'Currency *' }).click();
           

            // Click Search
            await page.locator('#idIframe').contentFrame().getByRole('button', { name: 'Search', exact: true }).click();
            await page.waitForTimeout(3000);


    });

  });

});