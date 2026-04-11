import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CreateEventPage } from '../pages/CreateEventPage';
import { FillBookingForm } from '../pages/FillBookingForm';
import { UserData } from '../test-data/userData';

const url = "https://eventhub.rahulshettyacademy.com";

test.only('Whole creation, booking and valiation of an event event', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const createEvent = new CreateEventPage(page);
    const fillBooking = new FillBookingForm(page);
    const user = UserData();

    await page.goto(url);

    //Step 1
    await loginPage.login(user.Email, user.Password);
    await expect(page.locator('span:has-text("Browse Events")')).toBeVisible();

    //Step 2
    await page.getByRole('button', { name: 'Admin' }).click();
    await page.getByRole('navigation').getByRole('link', { name: 'Manage Events' }).click();
    await expect(page).toHaveURL(/admin\/events/);
    await createEvent.eventFiller(user.Event, user.EventDesc, user.City, user.Venue, user.DateTime, user.Price, user.Seats);
    await expect(page.getByText('✓Event created!×')).toHaveText("✓Event created!×");

    //Step 3 - NOTE: Create a helper for this and step 8
    await page.getByTestId('nav-events').click();
    const eventCards = page.getByTestId('event-card');
    await expect(eventCards.first()).toBeVisible();
    const myEventCard = eventCards.filter({ hasText: user.Event });
    await expect(myEventCard).toBeVisible({ timeout: 5000 });
    const seatsText = await myEventCard.locator('span').last().textContent();
    const seatsBeforeBooking = parseInt(seatsText.match(/\d+/)[0]);

    //Step 4
    await myEventCard.getByTestId('book-now-btn').click();

    //Step 5
    expect(parseInt(await page.locator('#ticket-count').textContent())).toBe(1);
    await fillBooking.bookingFormFiller(user.FullName, user.Email, user.Phone);

    //Step 6
    await expect(page.locator('.booking-ref')).toBeVisible();
    const bookingRef = await page.locator('.booking-ref').textContent();

    //Step 7
    await page.getByRole('button', {name: 'View My Bookings'}).click();
    await expect(page).toHaveURL(/\/bookings$/);
    const bookingCards = page.locator('#booking-card');
    await expect(bookingCards.first()).toBeVisible();
    const bookingCard = bookingCards.filter({ hasText: bookingRef });
    await expect(bookingCard).toBeVisible();
    await expect(bookingCard.locator('h3')).toHaveText(user.Event);

    //Step 8 - NOTE: See step 3
    await page.getByTestId('nav-events').click();
    const eventCards1 = page.getByTestId('event-card');
    await expect(eventCards1.first()).toBeVisible();
    const myEventCard1 = eventCards1.filter({ hasText: user.Event });
    await expect(myEventCard1).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(500); //Aqui puedo mejorar el codigo, no usar un manual wait, si no mejor usar algo que espere la respuesta actualizada de la API
    const seatsText1 = await myEventCard1.locator('span').last().textContent();
    const seatsAfterBooking = parseInt(seatsText1.match(/\d+/)[0]);
    expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});