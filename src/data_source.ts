import 'reflect-metadata';
import { DataSource } from 'typeorm';
import User from './entities/mysql/user';
import Ioredis from 'ioredis';
import * as mongoose from 'mongoose';
import Redis from 'ioredis/built/Redis';
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'momo',
  password: '123456',
  database: 'momo',
  synchronize: false, // 自动同步新增的表结构到真实数据库
  logging: true, // 可以打印请求的sql语句
  entities: [User],
  migrations: [],
  subscribers: [],
  debug: false,
});

export class ioRedis {
  redis: Redis;
  constructor() {
    this.redis = new Ioredis({
      host: '127.0.0.1',
      port: 6379,
      password: '123456',
      db: 0,
      maxRetriesPerRequest: 5,
    });
    this.redis.on('ready', () => {
      console.log('ready to Redis');
    });
    this.redis.on('error', (error) => {
      console.log('Redis error:', error);
    });
  }
}

export class mongoDb {
  db;
  constructor() {
    mongoose
      .connect(`mongodb://${'127.0.0.1'}:27017`, {})
      .then((res) => {
        console.log('mongoose连接成功');
      })
      .catch((err) => {
        console.log('mongoose连接失败');
      });
    // this.db = mongoose;
  }
}
