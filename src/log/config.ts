import * as path from 'path';
const baseLogPath = path.resolve(
  __dirname,
  process.env.NODE_ENV === 'development' ? './logs' : '../../../koa_logs',
);

import * as Log4js from 'log4js';
import { Context } from 'koa';

const log4jsConfig: Log4js.Configuration = {
  appenders: {
    console: { type: 'tcp' }, // 控制打印至控制台
    // 统计日志
    access: {
      type: 'dateFile', // 写入文件格式，并按照日期分类
      filename: `${baseLogPath}/access/access.log`, // 日志文件名，会命名为：access.2021-04-01.log
      alwaysIncludePattern: true, // 为true, 则每个文件都会按pattern命名，否则最新的文件不会按照pattern命名
      pattern: 'yyyy-MM-dd', // 日期格式
      // maxLogSize: 10485760,  // 日志大小
      daysToKeep: 30, // 文件保存日期30天
      numBackups: 3, //  配置日志文件最多存在个数
      compress: true, // 配置日志文件是否压缩
      category: 'http', // category 类型
      keepFileExt: true, // 是否保留文件后缀
    },
    // 一些app的 应用日志
    app: {
      type: 'dateFile',
      filename: `${baseLogPath}/app-out/app.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern:
          "[%d{yyyy-MM-dd hh:mm:ss SSS}] [%p] -h: %h -pid: %z  msg: '%m' ",
      }, // 自定义的输出格式, 可参考 https://blog.csdn.net/hello_word2/article/details/79295344
      pattern: 'yyyy-MM-dd',
      daysToKeep: 30,
      numBackups: 3,
      keepFileExt: true,
    },
    // 异常日志
    errorFile: {
      type: 'dateFile',
      filename: `${baseLogPath}/error/error.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern:
          "[%d{yyyy-MM-dd hh:mm:ss SSS}] [%p] -h: %h -pid: %z  msg: '%m' ",
      },
      pattern: 'yyyy-MM-dd',
      daysToKeep: 30,
      numBackups: 3,
      keepFileExt: true,
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
  },

  categories: {
    default: {
      appenders: ['console', 'access', 'app', 'errors'],
      level: 'DEBUG',
    },
    mysql: { appenders: ['access', 'errors'], level: 'info' },
    http: { appenders: ['access'], level: 'DEBUG' },
  },
};
Log4js.configure(log4jsConfig);

// 自定义输出格式，确定哪些内容输出到日志文件中
const formatError = (ctx, err) => {
  const { method, url } = ctx;
  const body = ctx.request.body;
  const user = ctx.state.user;

  // 将请求方法，请求路径，请求体，登录用户，错误信息
  return { method, url, body, user, err };
};

// 生成一个error类型的日志记录器
export const errorLogger = Log4js.getLogger('error');

// 生成一个response类型的日志记录器
export const resLogger = Log4js.getLogger('response');

export const setErrorLogger = (ctx: Context, err) => {
  errorLogger.error(formatError(ctx, err));
};

// 生成一个控制台类型的日志记录器
const console = Log4js.getLogger();
