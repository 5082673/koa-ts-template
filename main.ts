import 'reflect-metadata';
import Koa from 'koa';
// import bodyParser from 'koa-bodyparser';
import router from './src/router';
import koaStatic from 'koa-static';
import path from 'path';
import koaBody from 'koa-body';
import { mkdirsSync } from './src/utils';
import { AppDataSource, ioRedis, mongoDb } from './src/data_source';
import './src/tasks';
import { catchError } from './src/middlewares/catcherror';
import apiRequest from './src/middlewares/apiRequest';
import { setErrorLogger } from './src/log/config';
const app = new Koa();
async function load() {
  app.use(apiRequest);
  app.use(catchError);
  try {
    await AppDataSource.initialize();
  } catch (e) {
    console.log('typeorm', e);
  }
  new ioRedis();
  // new mongoDb();
  app.use(
    koaBody({
      multipart: true, // 支持文件上传
      // encoding: 'gzip',
      formidable: {
        uploadDir: path.join(__dirname, 'static/upload/'), // 设置文件上传目录
        keepExtensions: true, // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
        onFileBegin: (name, file) => {
          const filePrefix = 'static/upload';
          const filePath = path.join(__dirname, `${filePrefix}`);
          mkdirsSync(filePath);
          // 文件上传前的设置
          // console.log(`name: ${name}`);
          // console.log(file);
        },
      },
    }),
  );

  // 静态资源目录对于相对入口文件main.ts的路径
  const staticPath = './static';
  app.use(koaStatic(path.join(__dirname, staticPath)));

  // 注册路由
  app.use(router.routes());

  app.on('error', (err, ctx) => {
    setErrorLogger(ctx, err);
  });
}

load();

const port = process.env.NODE_ENV === 'development' ? 29997 : 3010;
// 监听端口
app.listen(port, () => {
  console.log('Server running on port ' + `http://127.0.0.1:${port}`);
});
