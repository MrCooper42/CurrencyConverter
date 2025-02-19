import { z } from 'zod';

import { SupportedCurrencies } from '@models/supportedCurrencies.models';

const getConversionAuthValidator = z.object({
    Authorization: z.string().startsWith('Bearer ').min(8),
});

const getConversionValidator = z.object({
    from: z.nativeEnum(SupportedCurrencies),
    to: z.nativeEnum(SupportedCurrencies),
    amount: z.number(),
});

export { getConversionAuthValidator, getConversionValidator };
