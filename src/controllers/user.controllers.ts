import { Request, Response } from 'express';

import { getConversionValidator } from '@validators/user.validators';

import {
    createNewUser,
    getUserbyId,
    updateUser,
} from '@services/user.services';

import { ApiError } from '@utils/apiError';
import { apiResponse } from '@utils/apiResponse';
import { asyncHandler } from '@utils/asyncHandler';
import { responseMessage } from '@utils/responseMessage';
import { RESPONSE_STATUS } from '@utils/responseStatus';

const createUser = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;

    const result = createUserValidator.safeParse(body);
    if (!result.success) {
        throw new ApiError(RESPONSE_STATUS.FORBIDDEN, {
            message: result.error.issues,
        });
    }

    const { email, name, password } = body as createUserType;

    const newUserObj = {
        email,
        name,
        password,
    };

    const newUser = await createNewUser(newUserObj);

    return apiResponse(res, RESPONSE_STATUS.CREATED, {
        data: newUser,
        message: responseMessage.USER.CREATED,
    });
});

const getConversion = asyncHandler(async (req: Request, res: Response) => {
    const params = req.query;
    const authorization = req.headers.authorization;

    const paramsValidation = getConversionValidator.safeParse(params);
    console.log({
        params,
        authorization,
    });
    const { id } = params;

    const getUserData = await getUserbyId(id);

    return apiResponse(res, RESPONSE_STATUS.SUCCESS, {
        data: getUserData,
        message: responseMessage.USER.RETRIEVED,
    });
});

const updateUserData = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const params = req.params;

    const bodyValid = updateUserValidator.safeParse(body);
    if (!bodyValid.success) {
        throw new ApiError(RESPONSE_STATUS.FORBIDDEN, {
            message: bodyValid.error.issues,
        });
    }

    const { id } = params;
    const { name } = body as updateUserType;

    const updateData = await updateUser(id, {
        name,
    });

    return apiResponse(res, RESPONSE_STATUS.SUCCESS, {
        data: updateData,
        message: responseMessage.USER.UPDATED,
    });
});

export { getConversion };
