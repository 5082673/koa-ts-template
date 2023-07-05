import Router from 'koa-router';
import * as api from '../utils/public';
import * as path from 'path';
import { fsDel, fsRename, isArray, mkdirsSync } from '../utils';
import { File } from 'formidable';
import dayjs from 'dayjs';
import User from '../entities/mysql/user';
import { AppDataSource, ioRedis } from '../data_source';
import xlsx from 'node-xlsx';
import { getModelForClass } from '@typegoose/typegoose';
import { apiRequestLog } from '../entities/mongdb/apiRequestLog';
const router = new Router();
const IoRedis = new ioRedis();
router.all('/', async (ctx) => {
  const request = ctx.request;
  const query = request.query;
  const body = request.body;
  ctx.body = api.success({
    data: 'hello',
    extend: {
      request,
      query,
      body,
    },
  });
});

router.post('/login', async (ctx) => {
  const cookies = ctx.cookies;
  await cookies.set('userId', 'mo1', {
    // domain: '127.0.0.1', // 写cookie所在的域名
    // path: '/login', // 写cookie所在的路径
    // maxAge: 10 * 60 * 1000, // cookie有效时长
    // expires: new Date('2024-02-15'), // cookie失效时间
    // httpOnly: false, // 是否只用于http请求中获取
    // overwrite: true, // 是否允许重写
  });
  const userId = cookies.get('userId');
  console.log(userId, 'userId');
  ctx.body = api.success({
    msg: '请求成功',
    extend: {
      cookies: cookies.get('userId'),
    },
  });
});

type Results = (Partial<File> & {
  url: string;
  fileName?: string;
})[];
router.post('/upload', async (ctx) => {
  const file: File[] | File = ctx.request.files.file;
  const filePrefix = 'static/upload';
  const time = dayjs().format('YYYYMMDD');
  const filePath = path.join(__dirname, `../../${filePrefix}/${time}`);
  mkdirsSync(filePath);
  const results: Results = [];
  if (isArray(file)) {
    for (let i = 0; i < file.length; i++) {
      const res = file[i];
      const basename = path.basename(res.filepath);
      fsRename(res.filepath, filePath + '/' + basename);
      results.push({
        size: res.size,
        url: `${ctx.origin}/upload/${time}/${basename}`,
        fileName: basename,
      });
    }
  } else {
    const basename = path.basename(file.filepath);
    fsRename(file.filepath, filePath + '/' + basename);
    results.push({
      size: file.size,
      url: `${ctx.origin}/upload/${time}/${basename}`,
      fileName: basename,
    });
  }

  ctx.body = api.success({ data: results });
});

router.get('/getUserInfo', async (ctx) => {
  const query = ctx.request.query;
  const id = query.id;
  if (!id) {
    return (ctx.body = api.error({ msg: '请输入id' }));
  }
  const userRepository = AppDataSource.manager.getRepository(User);
  const data = await userRepository.findOne({
    where: { id: Number(id) },
    select: ['id', 'name', 'description'],
  });
  ctx.body = api.success({ data });
});

router.post('/excel', async (ctx) => {
  const file: File[] | File = ctx.request.files.file;
  const excel = isArray(file) ? file[0] : file;
  const workSheetsFromFile = xlsx.parse(excel.filepath);
  const excelData = workSheetsFromFile[0].data;
  const tr = excelData[0];
  const td = excelData.splice(1, excelData.length - 1);
  ctx.body = api.success({
    data: {
      tr,
      td,
    },
  });
  fsDel(excel.filepath);
});

router.all('/setRedisInfo', async (ctx) => {
  const randomInt = Math.floor(Math.random() * 11);
  IoRedis.redis.set(
    'userInfo',
    JSON.stringify({ randomInt }),
    (err, result) => {
      console.log(err);
      console.log(result);
    },
  );
  ctx.body = api.success({ data: '成功' });
});

router.all('/getRedisInfo', async (ctx) => {
  const userInfo = JSON.parse((await IoRedis.redis.get('userInfo')) || '{}');
  ctx.body = api.success({ data: userInfo });
});

const apiRequestLogModel = getModelForClass(apiRequestLog);
router.get('/getApiLog', async (ctx) => {
  const query = ctx.request.query;
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const num = Number(page) * limit - limit;
  const count = await apiRequestLogModel.find().count();
  const list = await apiRequestLogModel
    .find()
    .limit(limit)
    .skip(num)
    .sort({ createTime: 'desc' })
    .exec();
  ctx.body = api.success({
    data: {
      list,
      page,
      limit,
      count,
    },
  });
});

export default router;
