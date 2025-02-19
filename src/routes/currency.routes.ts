import { Router } from 'express';

import { getConversion } from '@controllers/user.controllers';

const userRouter = Router();

userRouter.get('/currency/conversion', getConversion);

export { userRouter };
