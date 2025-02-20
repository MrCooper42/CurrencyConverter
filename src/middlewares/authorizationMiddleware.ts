import { NextFunction, Request, Response } from 'express';

import { logger } from '@logger/logger';
import { getConversionAuthValidator } from '@validators/currency.validators';

import { ApiError } from '@utils/apiError';
import { responseMessage } from '@utils/responseMessage';
import { RESPONSE_STATUS } from '@utils/responseStatus';

const validateAuth = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;

    try {
        getConversionAuthValidator.parse({ authorization });
    } catch (error) {
        logger.error(error);
        throw new ApiError(
            RESPONSE_STATUS.UN_AUTHORIZED,
            responseMessage.CURRENCY.UNAUTHORIZED,
        );
    }

    next();
};

export { validateAuth };
