import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { UserData } from '../../test-data/userData';
import { waitForApi } from '../../utils/waitForApi';
import { FillBookingForm } from '../../pages/FillBookingForm';

const url = "https://eventhub.rahulshettyacademy.com";

test('Cancelling one item validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const fillBooking = new FillBookingForm(page);
    const user = UserData();

    await page.goto(url);
    await loginPage.login(user.Email[7], user.Password);

    //Booking
    await page.getByRole('button', { name: 'Events' }).click();
    const eventCard = page.getByTestId('event-card').first();
    await eventCard.getByTestId('book-now-btn').click();
    
    await expect(page.locator('#ticket-count')).toHaveText('1');
    await fillBooking.bookingFormFiller(user.FullName, user.Email[7], user.Phone);

    //Go to bookings and cancel one
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