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

