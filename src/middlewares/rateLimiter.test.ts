import { uuid } from 'uuidv4';

import { rateLimiter } from './rateLimiter';

import { ApiError } from '../utils/apiError';
import { responseMessage } from '../utils/responseMessage';
import { RESPONSE_STATUS } from '../utils/responseStatus';

describe('rateLimiter()', () => {
    let callback: any;
    let request: any;
    let response: any;
    const expectedError = new ApiError(
        RESPONSE_STATUS.TOO_MANY_REQUEST,
        responseMessage.OTHER.RATE_LIMIT,
    );
    const setWeekday = () => {
        jest.useFakeTimers()
            // set default to week day
            .setSystemTime(new Date('2025-02-20'));
    };
    const setWeekend = () => {
        jest.useFakeTimers()
            // set default to week day
            .setSystemTime(new Date('2025-02-23'));
    };
    beforeEach(() => {
        callback = jest.fn();
        request = {
            headers: {
                Authorization: uuid(),
            },
        };
    });

    describe('On weekdays', () => {
        beforeEach(() => {
            setWeekday();
        });
        it('Allows 1 calls', () => {
            try {
                for (let i = 0; i < 1; i++) {
                    rateLimiter(request, response, callback);
                }
                expect(callback).toBeCalledTimes(1);
            } catch (error) {
                expect(error).toBeFalsy();
            }
        });
        it('Allows 100 calls', () => {
            try {
                for (let i = 0; i < 100; i++) {
                    rateLimiter(request, response, callback);
                }
                expect(callback).toBeCalledTimes(100);
            } catch (error) {
                expect(error).toBeFalsy();
            }
        });

        it('Throws error on 101 calls', () => {
            try {
                for (let i = 0; i < 101; i++) {
                    rateLimiter(request, response, callback);
                }
            } catch (error) {
                expect(callback).toBeCalledTimes(100);
                expect(error).toEqual(expectedError);
            }
        });
    });

    describe('On weekends', () => {
        beforeEach(() => {
            setWeekend();
        });
        it('Allows 1 calls', () => {
            try {
                for (let i = 0; i < 1; i++) {
                    rateLimiter(request, response, callback);
                }
                expect(callback).toBeCalledTimes(1);
            } catch (error) {
                expect(error).toBeFalsy();
            }
        });
        it('Allows 100 calls', () => {
            try {
                for (let i = 0; i < 100; i++) {
                    rateLimiter(request, response, callback);
                }
                expect(callback).toBeCalledTimes(100);
            } catch (error) {
                expect(error).toBeFalsy();
            }
        });

        it('Allows 101 calls', () => {
            try {
                for (let i = 0; i < 101; i++) {
                    rateLimiter(request, response, callback);
                }
                expect(callback).toBeCalledTimes(101);
            } catch (error) {
                expect(error).toBeFalsy();
            }
        });

        it('Allows 200 calls', () => {
            try {
                for (let i = 0; i < 200; i++) {
                    rateLimiter(request, response, callback);
                }
                expect(callback).toBeCalledTimes(200);
            } catch (error) {
                expect(error).toBeFalsy();
            }
        });

        it('Throws error on 201 calls', () => {
            try {
                for (let i = 0; i < 201; i++) {
                    rateLimiter(request, response, callback);
                }
            } catch (error) {
                expect(callback).toBeCalledTimes(200);
                expect(error).toEqual(expectedError);
            }
        });
    });

    describe('When requests are made between days', () => {
        let isDateChanged: boolean;
        beforeEach(() => {
            isDateChanged = false;
            setWeekday();
        });
        it('Allows 250 calls', () => {
            try {
                for (let i = 0; i < 250; i++) {
                    rateLimiter(request, response, callback);
                    if (i >= 50 && !isDateChanged) {
                        isDateChanged = true;
                        setWeekend();
                    }
                }
                expect(callback).toBeCalledTimes(250);
            } catch (error) {
                expect(error).toBeFalsy();
            }
        });

        it('Throws error on 251 calls', () => {
            try {
                for (let i = 0; i < 251; i++) {
                    rateLimiter(request, response, callback);
                    if (i >= 50 && !isDateChanged) {
                        isDateChanged = true;
                        jest.useFakeTimers()
                            // set default to week day
                            .setSystemTime(new Date('2025-02-23'));
                    }
                }
            } catch (error) {
                expect(callback).toBeCalledTimes(250);
                expect(error).toEqual(expectedError);
            }
        });
    });
});
