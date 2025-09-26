import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

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
// : TestData[];

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
      test.use({
        viewport: { width: 940, height: 1080 }, // Set the window size for this test
      });

        test(`Should display correct compensation info for ${role} in ${seniorty} in ${country} in ${currency}`, async ({ page }) => {
          
            await page.goto("https://www.deel.com/salary-insights/?utm_source=global-hiring-toolkit");
            await page.waitForLoadState("load");

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
            // getByText('United States').click();

            // Click Search
            await page.locator('#idIframe').contentFrame().getByRole('button', { name: 'Search', exact: true }).click();
            await page.waitForTimeout(3000);

            await page.close();

        });
        
      });

    });
    