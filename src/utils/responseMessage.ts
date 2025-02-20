const responseMessage = {
    CURRENCY: {
        CONVERTED: 'Currency successfully converted',
        INVALID_REQUEST: 'Invalid or missing required query parameters',
        UNAUTHORIZED: 'Missing or invalid credentials',
    },
    OTHER: {
        SERVER_ERROR: 'Internal Server Error',
        RATE_LIMIT: 'Rate limit exceeded',
    },
};

export { responseMessage };
