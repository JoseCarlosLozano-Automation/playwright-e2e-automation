import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CreateEventPage } from '../../pages/CreateEventPage';
import { FillBookingForm } from '../../pages/FillBookingForm';
import { GetSeatsCount } from '../../pages/GetSeatsCount';
import { UserData } from '../../test-data/userData';

const url = "https://eventhub.rahulshettyacademy.com";

test('Full creation, booking and valiation of an event event - E2E', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const createEvent = new CreateEventPage(page);
    const fillBooking = new FillBookingForm(page);
    const getSeats = new GetSeatsCount(page);
    const user = UserData();

    await page.goto(url);

    //Step 1 - Log in
    await loginPage.login(user.Email, user.Password);
    await expect(page.locator('span:has-text("Browse Events")')).toBeVisible();

    //Step 2 - Create an event
    await page.getByRole('button', { name: 'Admin' }).click();
    await page.getByRole('navigation').getByRole('link', { name: 'Manage Events' }).click();
    await expect(page).toHaveURL(/admin\/events/);
    await createEvent.eventFiller(user.Event, user.EventDesc, user.City, user.Venue, user.DateTime, user.Price, user.Seats);
    await expect(page.getByText('✓Event created!×')).toHaveText("✓Event created!×");

    //Step 3 - Get the seats count before booking
    await page.getByTestId('nav-events').click();
    const seatsBeforeBooking =  await getSeats.seatsCount(user.Event);

    //Step 4 - Pre booking
    await getSeats.clickBookNow(user.Event);

    //Step 5 - Booking
    await expect(page.locator('#ticket-count')).toHaveText('1');
    await fillBooking.bookingFormFiller(user.FullName, user.Email, user.Phone);

    //Step 6 - Getting the booking ref
    await expect(page.locator('.booking-ref')).toBeVisible();
    const bookingRef = await page.locator('.booking-ref').textContent();

    //Step 7 - Booking validation
    await page.getByRole('button', {name: 'View My Bookings'}).click();
    await expect(page).toHaveURL(/\/bookings$/);
    const bookingCards = page.locator('#booking-card');
    await expect(bookingCards.first()).toBeVisible();
    const bookingCard = bookingCards.filter({ hasText: bookingRef });
    await expect(bookingCard).toBeVisible();
    await expect(bookingCard.locator('h3')).toHaveText(user.Event);

    //Step 8 - Last comparation, before and after booking
    await page.getByTestId('nav-events').click();
    const seatsAfterBooking = await getSeats.seatsCount(user.Event); 
    expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});