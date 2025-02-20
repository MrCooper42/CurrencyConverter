import { convertCurrency } from '../currencyConverter';

describe('convertCurrency()', () => {
    it('converts 1 to 1', () => {
        const response = convertCurrency('1', '97149.295');
        expect(response).toBe('97149.295');
    });

    it('converts 1000000 to 97149295000', () => {
        const response = convertCurrency('1000000', '97149.295');
        expect(response).toBe('97149295000');
    });

    it('converts 1234 to 119,882,230.03', () => {
        const response = convertCurrency('1234', '97149.295');
        expect(response).toBe('119882230.03');
    });
});
