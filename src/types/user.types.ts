interface User {
    _id?: string;
    /**
     * This should be an ISO string
     */
    lastRequest: string;
    requestCount: number;
}

export { User };
