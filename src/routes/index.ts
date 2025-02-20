import { Router } from 'express';

import { currencyRouter } from '@routes/currency.routes';

const rootRouter = Router();

rootRouter.use('/currency', currencyRouter);

export { rootRouter };
