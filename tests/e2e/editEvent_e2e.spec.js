import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CreateEventPage } from '../../pages/CreateEventPage';
import { FillBookingForm } from '../../pages/FillBookingForm';
import { GetSeatsCount } from '../../pages/GetSeatsCount';
import { UserData } from '../../test-data/userData';

const url = "https://eventhub.rahulshettyacademy.com";

test('Edit a previously created event - E2E', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const createEvent = new CreateEventPage(page);
    const fillBooking = new FillBookingForm(page);
    const getSeats = new GetSeatsCount(page);
    const user = UserData();

    await page.goto(url);

    // Log in
    await loginPage.login(user.Email[0], user.Password);
    await expect(page.locator('span:has-text("Browse Events")')).toBeVisible();

    // Create an event using the +Add New Event button from the Upcoming events page
    await page.getByRole('button', { name: 'Events' }).click();
    await page.getByRole('button', { name: 'Add New Event' }).click();
    await expect(page).toHaveURL(/admin\/events/);

    // Fill in the event details and submit the form
    const eventName = user.Event + " - Edit Test";
    const eventDesc = user.EventDesc;
    const eventCity = user.City;
    const eventVenue = user.Venue;
    const eventDateTime = user.DateTime;
    const eventPrice = user.Price;
    const eventSeats = user.Seats;
    await createEvent.eventFiller(eventName, eventDesc, eventCity, eventVenue, eventDateTime, eventPrice, eventSeats);
    await expect(page.getByText('✓Event created!×')).toHaveText("✓Event created!×");

    // Search for the created event and navigate to its details page;
    const bookingCard = page.getByTestId('event-table-row').filter({ hasText: eventName });
    await bookingCard.getByRole('button', { name: 'Edit' }).click();

    // Validate that the event details are pre-filled in the form
    await expect(page.getByTestId('event-title-input')).toHaveValue(eventName);
    await expect(page.getByPlaceholder('Describe the event…')).toHaveValue(eventDesc);
    await expect(page.locator('#city')).toHaveValue(eventCity);
    await expect(page.locator('#venue')).toHaveValue(eventVenue);
    await expect(page.locator('[id="event-date-&-time"]')).toHaveValue(eventDateTime);
    await expect(page.locator('[id="price-($)"]')).toHaveValue(eventPrice);
    await expect(page.locator('#total-seats')).toHaveValue(eventSeats);

    // Edit the event details
    const updatedEventName = eventName + " - Updated";
    const updatedEventDesc = eventDesc + " Updated description.";
    const updatedEventCity = eventCity + " Updated";
    const updatedEventVenue = eventVenue + " Updated";
    const updatedEventDateTime = user.DateTime;
    const updatedEventPrice = (parseInt(eventPrice) + 10).toString();
    const updatedEventSeats = (parseInt(eventSeats) + 20).toString();

    // Validate that the submit button text has changed to "Update Event" when editing an existing event
    await expect(page.getByTestId('add-event-btn')).toHaveText(/Update Event/);

    // Submit the updated event details and validate that the changes are reflected in the event details page
    await createEvent.eventFiller(updatedEventName, updatedEventDesc, updatedEventCity, updatedEventVenue, updatedEventDateTime, updatedEventPrice, updatedEventSeats);
    await expect(page.getByText('✓Event updated!×')).toHaveText("✓Event updated!×");

});