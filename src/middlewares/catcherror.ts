import { Context, Next } from 'koa';
import * as api from '../utils/public';
import { HttpException } from '../core/http-exception';
export const catchError = async (ctx: Context, next: Next) => {
  try {
    await next();
    if (ctx.response.status === 404) {
      ctx.body = api.error({ msg: ctx.response.message || '服务器异常' });
    }
  } catch (error) {
    // console.log('捕获到异常');
    if (error instanceof HttpException) {
      ctx.body = api.error({ msg: error.msg || '服务器异常' });
    } else {
      const msg = error.msg || error.sqlMessage || '服务器异常';
      ctx.body = api.error({ msg });
    }
  }
};
