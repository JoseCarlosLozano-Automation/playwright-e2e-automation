import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { FillBookingForm } from '../../pages/FillBookingForm';
import { GetSeatsCount } from '../../pages/GetSeatsCount';
import { UserData } from '../../test-data/userData';

const url = "https://eventhub.rahulshettyacademy.com";

test('Seats decrease after booking', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const fillBooking = new FillBookingForm(page);
    const getSeats = new GetSeatsCount(page);
    const user = UserData();

    await page.goto(url);
    await loginPage.login(user.Email, user.Password);

    await page.getByTestId('nav-events').click();
    const seatsBefore = await getSeats.seatsCount("Hollywood Monsoon Night — Los Angeles");
    await getSeats.clickBookNow("Hollywood Monsoon Night — Los Angeles");

    await expect(page.locator('#ticket-count')).toHaveText('1');
    await fillBooking.bookingFormFiller(user.FullName, user.Email, user.Phone);

    await page.getByTestId('nav-events').click();

    const seatsAfter = await getSeats.seatsCount("Hollywood Monsoon Night — Los Angeles");

    expect(seatsAfter).toBe(seatsBefore - 1);

});