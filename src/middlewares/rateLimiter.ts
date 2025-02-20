import { NextFunction, Request, Response } from 'express';
import { LRUCache } from 'lru-cache';

import { ApiError } from '@utils/apiError';
import { responseMessage } from '@utils/responseMessage';
import { RESPONSE_STATUS } from '@utils/responseStatus';

const cache = new LRUCache<string, number>({
    max: 5000,
    ttl: 1000 * 60 * 60 * 24, // Reset every 24 hours
});

const getCurrentLimit = () => {
    const day = new Date().getDay();
    const isWeekend = day === 0 || day === 6;
    const limit = isWeekend ? 200 : 100; // 200 for weekends 100 for week days

    return { day, limit };
};

// TODO: write unit tests for rate limiter;

const rateLimiter = (
    request: Request,
    _response: Response,
    next: NextFunction,
) => {
    const token = request.headers['Authorization'];
    const { day, limit } = getCurrentLimit();
    const cashKey = `${day}_${token}`;
    let requestCount = cache.get(cashKey) || 0;

    requestCount++;

    if (requestCount > limit) {
        throw new ApiError(
            RESPONSE_STATUS.TOO_MANY_REQUEST,
            responseMessage.OTHER.RATE_LIMIT,
        );
    }

    cache.set(cashKey, requestCount);
    next();
};

export { rateLimiter };
