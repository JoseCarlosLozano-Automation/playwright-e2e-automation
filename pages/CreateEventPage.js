export class CreateEventPage {
    constructor(page){
        this.page = page;
        this.eventTitle = page.getByTestId('event-title-input');
        this.eventDescription = page.getByRole('textbox', { name: 'Describe the event…' });
        this.eventCategory = page.getByLabel('Category*');
        this.eventCity = page.getByRole('textbox', { name: 'City*' });
        this.eventVenue = page.getByRole('textbox', { name: 'Venue*' });
        this.eventDateTime = page.getByRole('textbox', { name: 'Event Date & Time*' });
        this.eventPrice = page.getByRole('spinbutton', { name: 'Price ($)*' });
        this.eventTotalSeats = page.getByRole('spinbutton', { name: 'Total Seats*' });
        this.eventSubmit = page.getByTestId('add-event-btn');
    }

    async eventFiller(Event, EventDesc, City, Venue, DateTime, Price, Seats){
        await this.eventTitle.fill(Event);
        await this.eventDescription.fill(EventDesc);
        await this.eventCity.fill(City);
        await this.eventVenue.fill(Venue);
        await this.eventDateTime.fill(DateTime);
        await this.eventPrice.fill(Price);
        await this.eventTotalSeats.fill(Seats);
        await this.eventSubmit.click();
    }
}