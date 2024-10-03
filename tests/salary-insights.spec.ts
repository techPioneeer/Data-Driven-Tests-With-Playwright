import { test, expect } from '@playwright/test';
// const { webkit } = require('playwright');  // Or 'chromium' or 'firefox'.

test('Salary Insights Test - Simple', async ({ page }) => {
    //Navigate to the Salary Insights page
    await page.goto("https://www.deel.com/pt/salary-insights");
    // await page.waitForLoadState("load");

    const role = "QA Engineer";
    const country = "Bangladesh";


    // Select Role
    // await page.locator('#idIframe').contentFrame().locator('.MuiInputBase-root').first().click();
    await page.locator('#idIframe').contentFrame().getByPlaceholder('Select a Role *').fill('Fullstack Engineer');
    await page.locator('#idIframe').contentFrame().getByRole('listbox', { name: 'Role *' }).click();

    // Select Level
    // await page.locator('#idIframe').contentFrame().locator('div:nth-child(2) > .MuiFormControl-root > .MuiInputBase-root').first().click();
    await page.locator('#idIframe').contentFrame().getByRole('combobox', { name: 'Seniorty Level *' }).fill('Junior');
    await page.locator('#idIframe').contentFrame().getByRole('option', { name: 'Junior' }).locator('div').first().click();

    // Select Country   
    // await page.locator('#idIframe').contentFrame().locator('div:nth-child(3) > div > .MuiFormControl-root > .MuiInputBase-root').first().click();
    await page.locator('#idIframe').contentFrame().getByPlaceholder('Country *').fill('Canada');
    await page.locator('#idIframe').contentFrame().getByRole('listbox', { name: 'Country *' }).locator('div').nth(3).click();

    // Select Currency
    // await page.locator('#idIframe').contentFrame().locator('div:nth-child(3) > div:nth-child(2) > .MuiFormControl-root > .MuiInputBase-root').click();
    await page.locator('#idIframe').contentFrame().getByRole('combobox', { name: 'Currency' }).fill('usd');
    await page.locator('#idIframe').contentFrame().getByText('United States').click();

    // Click Search
    await page.locator('#idIframe').contentFrame().getByRole('button', { name: 'Search', exact: true }).click();

    // Assertions
    await expect(page.locator('#idIframe').contentFrame().getByText('How much does a junior Fullstack Engineer make in Canada')).toBeVisible();

    /*
    // const salaryQuestion = await page.locator('#idIframe').contentFrame().locator('xpath=//*[@id="results"]/div/div/div/div[3]/p[1]').innerText();
    // expect(salaryQuestion).toContain('How much does a Junior QA Engineer make in');
    // expect(salaryQuestion).toContain('Bangladesh');
    */

    await expect(page.locator('#idIframe').contentFrame().locator('xpath=//*[@id="results"]/div/div/div/div[3]/p[1]').getByText('Fullstack Engineer')).toBeVisible();
    await expect(page.locator('#idIframe').contentFrame().locator('xpath=//*[@id="results"]/div/div/div/div[3]/p[1]').getByText('Canada')).toBeVisible();

    // compnsationDetails
    await expect(page.locator('#idIframe').contentFrame().getByText('The median salary is $54810.02 per year for a Fullstack Engineer in Canada. Salary estimates are based on anonymous submissions by Business Development employees.')).toBeVisible();

    const compnsationDetails = await page.locator('#idIframe').contentFrame().locator('xpath=//*[@id="results"]/div/div/div/div[3]/p[2]').innerText();
    expect(compnsationDetails).toContain('Fullstack Engineer');
    expect(compnsationDetails).toContain('Canada');

});
