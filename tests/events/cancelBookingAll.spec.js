import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { UserData } from '../../test-data/userData';
import { waitForApi } from '../../utils/waitForApi';
import { FillBookingForm } from '../../pages/FillBookingForm';

const url = "https://eventhub.rahulshettyacademy.com";

test('Cancelling all items validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const fillBooking = new FillBookingForm(page);
    const user = UserData();

    await page.goto(url);
    await loginPage.login(user.Email[6], user.Password);
    
    //Booking
    await page.getByRole('button', { name: 'Events' }).click();
    const eventCard = page.getByTestId('event-card').first();
    await eventCard.getByTestId('book-now-btn').click();
    
    await expect(page.locator('#ticket-count')).toHaveText('1');
    await fillBooking.bookingFormFiller(user.FullName, user.Email[6], user.Phone);

    //Go to bookings and cancel all
    await page.getByRole('button', { name: 'My Bookings' }).click();
    await expect(page).toHaveURL(/\/bookings$/);
    await waitForApi(page, '/api/booking');

    const bookingCard = page.locator('#booking-card');
    await expect(bookingCard.last()).toBeVisible();

    page.on('dialog', async dialog => {
        await dialog.accept();
    });

    await page.getByRole('button', { name: 'Clear all bookings' }).click();

    await expect(bookingCard).toHaveCount(0);
    await expect(page.locator('h3.text-lg')).toHaveText('No bookings yet');

    //Go back to events page
    await page.getByRole('button', { name: 'Browse Events' }).click();
    await expect(page).toHaveURL(/\/events$/);

});