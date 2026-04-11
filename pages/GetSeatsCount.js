import { expect } from '@playwright/test';

export class GetSeatsCount {
    constructor(page){
        this.page = page;
        this.eventCards = page.getByTestId('event-card');
    }

    async seatsCount(eventName){
        await expect(this.eventCards.first()).toBeVisible();

        const myEventCard = this.eventCards.filter({ hasText: eventName });
        await expect(myEventCard).toBeVisible();
        await this.page.waitForTimeout(300); // I have to update this to not use a manual wait but rather expect an API answer

        const seatsText = await myEventCard.locator('span').last().textContent();
        return parseInt(seatsText.match(/\d+/)[0]);
    }

    async clickBookNow(eventName){
        const myEventCard = this.eventCards.filter({ hasText: eventName });
        await expect(myEventCard).toBeVisible();

        await myEventCard.getByTestId('book-now-btn').click();
    }
}