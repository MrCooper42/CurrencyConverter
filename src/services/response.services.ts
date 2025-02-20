import { Prisma } from '@prisma/client';

import client from '@db/index';

const createNewResponse = async (data: Prisma.ResponseCreateInput) => {
    return await client.response.create({
        data,
    });
};

const getResponse = async (id: string) => {
    return await client.response.findUnique({
        where: {
            requestId: id,
        },
    });
};

const updateResponse = async (id: string, data: Prisma.ResponseCreateInput) => {
    return await client.response.update({
        where: {
            requestId: id,
        },
        data,
    });
};

const deleteResponseById = async (id: string) => {
    return await client.response.delete({
        where: {
            requestId: id,
        },
    });
};

export { createNewResponse, getResponse, updateResponse, deleteResponseById };
