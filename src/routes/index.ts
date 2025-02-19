import { Router } from 'express';

import { userRouter } from '@routes/currency.routes';

const rootRouter = Router();

rootRouter.use('/user', userRouter);

export { rootRouter };
