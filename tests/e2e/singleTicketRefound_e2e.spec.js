import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CreateEventPage } from '../../pages/CreateEventPage';
import { FillBookingForm } from '../../pages/FillBookingForm';
import { GetSeatsCount } from '../../pages/GetSeatsCount';
import { UserData } from '../../test-data/userData';

const url = "https://eventhub.rahulshettyacademy.com";

test.only('Single ticket booking is eligible for refund', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const fillBooking = new FillBookingForm(page);
    const user = UserData();

    await page.goto(url);

    //Step 1 - Log in
    await loginPage.login(user.Email, user.Password);
    await expect(page.locator('span:has-text("Browse Events")')).toBeVisible();

    //Step 2 - Book first event with 1 ticket (default)
    await page.getByTestId('nav-events').click();
    const eventCard = page.getByTestId('event-card').filter({ hasText: "Dilli Diwali Mela" });
    await eventCard.getByTestId('book-now-btn').click();
    await expect(page.locator('#ticket-count')).toHaveText('1');
    await fillBooking.bookingFormFiller(user.FullName, user.Email, user.Phone);

    //Step 3 - Navigate to booking detail
    await page.getByRole('button', {name: 'View My Bookings'}).click();
    await expect(page).toHaveURL(/\/bookings$/);
    await page.getByRole('button', { name: 'View Details' }).first().click();
    const bookingInfoBox = page.locator('.bg-white', { hasText: 'Booking Information' })
    await expect(bookingInfoBox).toBeVisible();

    //Step 4 - Validate booking ref
    const bookingRef = await page.locator('.font-mono').last().textContent();
    const bookingTitle = await page.locator('h1').textContent();
    expect(bookingRef?.[0]).toBe(bookingTitle?.[0]);

    //Step 5 - Check refund eligibility
    await page.getByTestId('check-refund-btn').click();
    await expect(page.locator('#refund-spinner')).toBeVisible();
    await expect(page.locator('#refund-spinner')).toBeHidden({ timeout: 6000 });






    //const bookingIdBeforeTrim = bookingInfoBox.locator('span', { hasText: 'Booking ID' }).locator('xpath=following-sibling::span').textContent();
    //const bookingId = bookingIdBeforeTrim.replace('#', '').trim();








});