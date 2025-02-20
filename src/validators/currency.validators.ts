import { Currencies } from '@prisma/client';
import { z } from 'zod';

const getConversionAuthValidator = z.object({
    authorization: z.string().startsWith('Bearer ').min(8),
});

const getConversionValidator = z.object({
    from: z.nativeEnum(Currencies),
    to: z.nativeEnum(Currencies),
    amount: z.coerce.number(),
});

export { getConversionAuthValidator, getConversionValidator };
