import { expect } from '@playwright/test';

export class GetSeatsCount {
    constructor(page){
        this.page = page;
        this.eventCards = page.getByTestId('event-card');
    }

    async seatsCount(eventName){
        await this.page.waitForResponse(response =>
            response.url().includes('/api/events') &&
            response.status() === 200 &&
            response.request().method() === 'GET'
        );

        const myEventCard = this.eventCards.filter({ hasText: eventName });
        await expect(myEventCard).toBeVisible();

        const seatsText = await myEventCard.locator('span').last().textContent();
        return parseInt(seatsText.match(/\d+/)[0]);
    }

    async clickBookNow(eventName){
        const myEventCard = this.eventCards.filter({ hasText: eventName });
        await expect(myEventCard).toBeVisible();

        await myEventCard.getByTestId('book-now-btn').click();
    }
}