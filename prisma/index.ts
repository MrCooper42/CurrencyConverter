import { PrismaClient } from '@prisma/client'
import { logger } from "@logger/logger";

const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ]
  })

  client.$on("query", (e) => {
    logger.debug('Query: ' + e.query)
    logger.debug('Params: ' + e.params)
    logger.debug('Duration: ' + e.duration + 'ms')
  })

  return client;
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const client = globalThis.prismaGlobal ?? prismaClientSingleton()

export default client

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = client