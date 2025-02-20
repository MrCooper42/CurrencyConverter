import { Router } from 'express';

import { getConversion } from '@controllers/currency.controllers';

const currencyRouter = Router();

currencyRouter.get('/conversion', getConversion);

export { currencyRouter };
