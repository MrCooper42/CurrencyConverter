import { Prisma } from '@prisma/client';

import client from '@db/index';

import { logger } from '@logger/logger';

import { ApiError } from '@utils/apiError';
import { responseMessage } from '@utils/responseMessage';
import { RESPONSE_STATUS } from '@utils/responseStatus';

const createNewUser = async (data: any) => {
    return await client.user.create({
        data,
    });
};

const getUserById = async (id: string) => {
    return await client.user.findUnique({
        where: {
            authToken: id,
        },
    });
};

const upsertUser = async (data: Prisma.UserCreateInput) => {
    try {
        const existingUser = await getUserById(data.authToken);
        if (existingUser) {
            await updateUser(data.authToken, {
                lastLogin: new Date(),
            });
        } else {
            await createNewUser(data);
        }
    } catch (error) {
        logger.error(error);
        throw new ApiError(
            RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            responseMessage.OTHER.SERVER_ERROR,
        );
    }
};

const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
    return await client.user.update({
        where: {
            authToken: id,
        },
        data,
    });
};

const deleteUserById = async (id: string) => {
    return await client.user.delete({
        where: {
            authToken: id,
        },
    });
};

export { createNewUser, getUserById, updateUser, upsertUser, deleteUserById };
