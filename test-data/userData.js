import { faker } from '@faker-js/faker';

export const UserData = () => {
    return {
        Email: ['test@testingmail.com',
                'test1@testingmail.com',
                'test2@testingmail.com',
                'test3@testingmail.com',
                'test4@testingmail.com',
                'test5@testingmail.com',
                'test6@testingmail.com',
                'test7@testingmail.com',
                'test8@testingmail.com',
                'test9@testingmail.com'],
        Password: 'Echo123$',
        Event: `Test Event ${Date.now()}`,
        EventDesc: faker.lorem.sentence(),
        City: faker.location.city(),
        Venue: faker.location.streetAddress(),
        Price: faker.number.int({ min: 100, max: 500 }).toString(),
        Seats: faker.number.int({ min: 10, max: 100 }).toString(),
        DateTime: '2026-07-14T18:00',
        FullName: faker.person.fullName(),
        Phone: `+91 ${faker.string.numeric(5)} ${faker.string.numeric(5)}`,
        BookingSeat: faker.number.int({ min: 1, max: 5 }).toString()
    };
};