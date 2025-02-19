class CoinbaseClientError implements Error {
    public message: string;
    public name: string;
    public status: number;
    private request: any;

    constructor(
        response: Response,
        request: Request,
        error: any,
        requestBody: any,
    ) {
        this.message = response.statusText;
        this.name = 'CoinbaseError';
        this.status = response.status;
        this.request = requestBody;
    }
}

export { CoinbaseClientError };
