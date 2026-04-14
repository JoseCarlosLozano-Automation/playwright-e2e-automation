import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { UserData } from '../../test-data/userData';

const url = "https://eventhub.rahulshettyacademy.com";

test('User can login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = UserData();

    await page.goto(url);
    await loginPage.login(user.Email, user.Password);

    await expect(page.locator('span:has-text("Browse Events")')).toBeVisible();
});