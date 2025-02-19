import createClient, { Client } from 'openapi-fetch';

import { coinbaseMiddleware } from '@middlewares/coinbaseMiddleware';

import { CoinBaseConfig } from '@models/coinbase.config';
import { ConversionRequest, ConversionResponse } from '@models/coinbase.models';

import { paths } from '../../coinbase/openapi-schema';

class CoinBaseClient {
    private client: Client<paths, any>;

    constructor(config: CoinBaseConfig) {
        this.client = createClient<paths>({
            baseUrl: config.baseUrl,
            cache: 'no-cache',
        });
        this.client.use(coinbaseMiddleware);
    }

    async getConversions(
        auth: string,
        body: ConversionRequest,
    ): Promise<ConversionResponse> {
        const response = await this.client.POST('/conversions', {
            body: {
                data: body,
            },
        });

        return response.data;
    }
}

export { CoinBaseClient };
