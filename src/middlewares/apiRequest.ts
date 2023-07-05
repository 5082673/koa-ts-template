import { Context, Next } from 'koa';
import { getModelForClass } from '@typegoose/typegoose';
import { apiRequestLog } from '../entities/mongdb/apiRequestLog';
import { resLogger } from '../log/config';
// const model = getModelForClass(apiRequestLog);
// 不记录的api接口
const noLogApi = ['/demo/getApiLog'];
export default async function apiRequest(ctx: Context, next: Next) {
  const oldTime = Date.now();
  try {
    // console.log(ctx, 'ctx1');
    await next();
  } catch (e) {
    // console.log(e);
  }
  if (!noLogApi.includes(ctx.request.url.split('?')[0])) {
    const time = Date.now() - oldTime;
    const data = {
      header: JSON.stringify(ctx.request.header),
      body: JSON.stringify(ctx.request.body),
      query: JSON.stringify(ctx.request.query),
      method: ctx.request.method,
      returnBody: JSON.stringify(ctx.body),
      timeConsuming: time,
      api: ctx.request.url.split('?')[0],
      host: ctx.request.host,
      ip: ctx.ip.split(':').pop(),
    };
    resLogger.info(data);
    // model.create(data);
  }
}
