import { expect } from '@playwright/test';

export class EventDetailsValidation {
    constructor(page){
        this.eventTitle = page.getByTestId('event-title-input');
        this.eventDescription = page.getByPlaceholder('Describe the event…');
        this.eventCity = page.locator('#city');
        this.eventVenue = page.locator('#venue');
        this.eventDateTime = page.locator('[id="event-date-&-time"]');
        this.eventPrice = page.locator('[id="price-($)"]');
    }

    async validateEventDetails(title, description, city, venue, dateTime, price){
        await expect(this.eventTitle).toHaveValue(title);
        await expect(this.eventDescription).toHaveValue(description);
        await expect(this.eventCity).toHaveValue(city);
        await expect(this.eventVenue).toHaveValue(venue);
        await expect(this.eventDateTime).toHaveValue(dateTime);
        await expect(this.eventPrice).toHaveValue(price);
    }
}
