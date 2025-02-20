import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

import { CoinBaseConfig } from '@models/coinbase.config';

import { logger } from '@logger/logger';
import { getConversionValidator } from '@validators/currency.validators';

import { CoinBaseClient } from '@services/coinbase.services';
import { createNewResponse } from '@services/response.services';
import { upsertUser } from '@services/user.services';

import { ApiError } from '@utils/apiError';
import { apiResponse } from '@utils/apiResponse';
import { asyncHandler } from '@utils/asyncHandler';
import { convertCurrency } from '@utils/currencyConverter';
import { responseMessage } from '@utils/responseMessage';
import { RESPONSE_STATUS } from '@utils/responseStatus';

const config: CoinBaseConfig = {
    baseUrl: 'https://api.coinbase.com',
};
const CurrencyClient = new CoinBaseClient(config);

const getConversion = asyncHandler(async (req: Request, res: Response) => {
    const params = req.query;
    let authorization = req.headers.authorization;

    let validatedParams;
    try {
        validatedParams = getConversionValidator.parse(params);
    } catch (error) {
        logger.error(error);
        throw new ApiError(
            RESPONSE_STATUS.BAD_REQUEST,
            responseMessage.CURRENCY.INVALID_REQUEST,
        );
    }

    authorization = authorization!.replace('Bearer ', '');
    const { from, to, amount } = validatedParams;

    const { data, requestId } = await CurrencyClient.getConversions(from);
    logger.debug({ rateResponse: data });
    // calculate conversion
    const conversionRate = data.rates?.[to];
    if (!conversionRate) {
        // zod should have thrown
        throw new ApiError(
            RESPONSE_STATUS.NOT_FOUND,
            `Unable to process rate to ${to}`,
        );
    }
    const convertedAmount = convertCurrency(amount.toString(), conversionRate);

    // create or update user
    const user: Prisma.UserCreateInput = {
        authToken: authorization,
    };
    // Not needed now handled by creating response
    await upsertUser(user);

    // create new request record
    const createNewRequestRecord: Prisma.RequestCreateInput = {
        id: requestId,
        from,
        amount,
        to,
        user: {
            connect: {
                authToken: authorization,
            },
        },
    };
    // create new response record
    const createNewResponseRecord: Prisma.ResponseCreateInput = {
        from,
        to,
        amount: convertedAmount,
        user: {
            connectOrCreate: {
                where: {
                    authToken: authorization,
                },
                create: user,
            },
        },
        request: {
            create: createNewRequestRecord,
        },
    };
    // store response
    try {
        const response = await createNewResponse(createNewResponseRecord);
        logger.debug(response);
    } catch (error) {
        logger.error(error);
        throw new ApiError(
            RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            responseMessage.OTHER.SERVER_ERROR,
        );
    }

    // return success
    return apiResponse(res, RESPONSE_STATUS.SUCCESS, {
        success: true,
        data: {
            from,
            amount: amount.toString(),
            to,
            convertedAmount,
        },
        message: responseMessage.CURRENCY.CONVERTED,
    });
});

export { getConversion };
