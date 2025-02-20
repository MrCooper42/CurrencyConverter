import { Currencies } from '@prisma/client';
import createClient, { Client } from 'openapi-fetch';
import { uuid } from 'uuidv4';

import {
    coinbaseMiddleware,
    internalRequestIdKey,
} from '@middlewares/coinbaseMiddleware';

import { CoinBaseConfig } from '@models/coinbase.config';
import { ExchangeRateResponse } from '@models/coinbase.models';

import { paths } from '../../coinbase/openapi-schema';

class CoinBaseClient {
    private client: Client<paths, any>;

    constructor(config: CoinBaseConfig) {
        this.client = createClient<paths>({
            baseUrl: config.baseUrl,
            cache: 'no-cache',
        });

        // set middleware for logging and capturing errors
        this.client.use(coinbaseMiddleware);
    }

    async getConversions(
        from: Currencies,
    ): Promise<{ data: ExchangeRateResponse; requestId: string }> {
        const response = await this.client.GET('/v2/exchange-rates', {
            params: {
                query: {
                    currency: from,
                },
            },
        });

        return {
            requestId:
                response.response.headers.get(internalRequestIdKey) ?? uuid(),
            data: response.data.data,
        };
    }
}

export { CoinBaseClient };
