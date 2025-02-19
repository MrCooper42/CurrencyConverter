import { Middleware } from "openapi-fetch";

import { CoinbaseClientError } from "@models/coinbase.error";

import { logger } from "@logger/logger";

const requestMap = new Map<string, string>();
const internalRequestIdKey = "internal-request-id";
/**
 * This is a middleware to capture any logs going out to coinbase
 */
const coinbaseMiddleware: Middleware = {
    async onRequest({ request }) {
        logger.info(
            `>>> Calling ${request.method} to ${request.url} for ${request.headers.get(internalRequestIdKey)}`
        );

        const requestId = Date.now().toString(36);
        const clonedRequest = await request.clone().text();

        // set these to ensure that we are capturing the request
        // in case we need to log the request in the error
        request.headers.set(internalRequestIdKey, requestId);
        requestMap.set(requestId, clonedRequest);

        return request;
    },
    async onResponse({ request, response }) {
        logger.info(
            `>>> Response ${request.method} from ${request.url} for ${request.headers.get(internalRequestIdKey)}`
        );

        if (response.ok) {
            return response;
        }

        const error = await response.json();
        const internalRequestId = request.headers.get(internalRequestIdKey);
        let requestBody;

        logger.error(error);

        if (internalRequestId) {
            requestBody = requestMap.get(internalRequestId);
            // make sure to clean up request
            requestMap.delete(internalRequestId);
        }

        throw new CoinbaseClientError(response, request, error, requestBody);
    }
};

export { coinbaseMiddleware };
