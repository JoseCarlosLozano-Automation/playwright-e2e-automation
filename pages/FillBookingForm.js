export class FillBookingForm {
    constructor(page){
        this.page = page;
        this.fullNameBox = page.getByRole('textbox', { name: 'Full Name*' });
        this.emailBox = page.getByTestId('customer-email');
        this.phoneBox = page.getByRole('textbox', { name: 'Phone Number*' });
        this.confirmBookingBtn = page.getByRole('button', { name: 'Confirm Booking' });
    }

    async bookingFormFiller(FullName, Email, Phone){
        await this.fullNameBox.fill(FullName);
        await this.emailBox.fill(Email);
        await this.phoneBox.fill(Phone);
        await this.confirmBookingBtn.click();
    }
}