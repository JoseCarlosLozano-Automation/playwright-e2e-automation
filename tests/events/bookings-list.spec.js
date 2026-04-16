import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { UserData } from '../../test-data/userData';
import { waitForApi } from '../../utils/waitForApi';

const url = "https://eventhub.rahulshettyacademy.com";

test('Booking appears in user bookings list', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = UserData();

    await page.goto(url);
    await loginPage.login(user.Email[0], user.Password);

    await page.getByRole('button', { name: 'My Bookings' }).click();

    await expect(page).toHaveURL(/\/bookings$/);

    await waitForApi(page, '/api/booking');

    const bookingCards = page.locator('#booking-card');
    await expect(bookingCards.last()).toBeVisible();
});