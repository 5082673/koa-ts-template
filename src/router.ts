import Router from 'koa-router';
import demoRouter from './modules/demo';

const router = new Router();

router.use('/demo', demoRouter.routes(), demoRouter.allowedMethods());

export default router;
