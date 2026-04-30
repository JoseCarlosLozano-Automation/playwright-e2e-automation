import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { UserData } from '../../test-data/userData';
import { waitForApi } from '../../utils/waitForApi';

const url = "https://eventhub.rahulshettyacademy.com";

test.only('Cancelling one item validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = UserData();

    await page.goto(url);
    await loginPage.login(user.Email[0], user.Password);

    await page.getByRole('button', { name: 'My Bookings' }).click();

    await expect(page).toHaveURL(/\/bookings$/);

    await waitForApi(page, '/api/booking');

    const bookingCard = page.locator('#booking-card');
    await expect(bookingCard.last()).toBeVisible();

    const refNumberfromCard = (await bookingCard.first().locator('.booking-ref').textContent())?.trim();
    await bookingCard.first().getByRole('button', { name: 'Cancel Booking' }).click();
    await expect(page.locator('p.text-sm')).toHaveText(`This will cancel ${refNumberfromCard} and release 1 seat(s) back to the event. This action cannot be undone.`);
    await page.getByRole('button', { name: 'Yes, cancel it' }).click();
    await expect(page.getByText('✓Booking cancelled')).toBeVisible();
    const cardsWithRef = bookingCard.filter({ hasText: refNumberfromCard });
    await expect(cardsWithRef).toHaveCount(0);

});