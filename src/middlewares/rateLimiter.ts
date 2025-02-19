import { NextFunction, Request, Response } from 'express';
import { LRUCache } from 'lru-cache';

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

const rateLimiter = (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    const ip = request.ip || request.headers['Authorization'];
    const { day, limit } = getCurrentLimit();
    const cashKey = `${day}_${ip}`;
    let requestCount = cache.get(cashKey) || 0;

    requestCount++;

    if (requestCount > limit) {
        response.status(429).json({
            error: 'Rate limit exceeded',
        });
        return;
    }

    cache.set(cashKey, requestCount);
    next();
};

export { rateLimiter };
