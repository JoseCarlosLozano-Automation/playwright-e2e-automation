import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CreateEventPage } from '../../pages/CreateEventPage';
import { UserData } from '../../test-data/userData';

const url = "https://eventhub.rahulshettyacademy.com";

test('Admin can create an event', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const createEvent = new CreateEventPage(page);
    const user = UserData();

    await page.goto(url);

    await loginPage.login(user.Email[8], user.Password);

    await page.getByRole('button', { name: 'Admin' }).click();
    await page.getByRole('navigation').getByRole('link', { name: 'Manage Events' }).click();

    await createEvent.eventFiller(user.Event, user.EventDesc, user.City, user.Venue, user.DateTime, user.Price, user.Seats);

    await expect(page.getByText('✓Event created!×')).toBeVisible();
});