import { test, expect } from '@playwright/test';
// const { webkit } = require('playwright');  // Or 'chromium' or 'firefox'.

// Declare a JSON arry of test data

const testData = [
    { role: "QA Engineer", seniorty: "Senior", country: "Canada", currency: "USD" },
    { role: "Fullstack Engineer", seniorty: "Junior", country: "Brazil", currency: "USD" },
    { role: "Devops Engineer", seniorty: "Middle", country: "United States", currency: "USD" },
    { role: "Devops Engineer", seniorty: "Senior", country: "United Kingdom", currency: "USD" },
];

test.describe('Salary Insights Tests Naive', () => {
    testData.forEach(({ role, seniorty, country, currency }) => {
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

