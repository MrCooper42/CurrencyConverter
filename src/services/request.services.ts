import { Prisma } from '@prisma/client';

import client from '@db/index';

const createNewRequest = async (data: Prisma.RequestCreateInput) => {
    return await client.request.create({
        data,
    });
};

const getRequest = async (id: string) => {
    return await client.request.findUnique({
        where: {
            id,
        },
    });
};

const updateRequest = async (id: string, data: Prisma.RequestCreateInput) => {
    return await client.request.update({
        where: {
            id,
        },
        data,
    });
};

const deleteRequestByID = async (id: string) => {
    return await client.request.delete({
        where: {
            id,
        },
    });
};

export { createNewRequest, getRequest, updateRequest, deleteRequestByID };
