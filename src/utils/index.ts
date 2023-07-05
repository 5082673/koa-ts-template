import fs from 'fs';
import path from 'path';

/**
 * @description: 判断值是否未某个类型
 */
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

/**
 * @description:  是否为数组
 */
export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val);
}

/**
 * @description: 是否为对象
 */
export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, 'Object');
};

/**
 * 同步创建文件目录
 * @param  {string} dirname 目录绝对地址
 * @return {boolean}        创建目录结果
 */
export function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  }
  if (mkdirsSync(path.dirname(dirname))) {
    fs.mkdirSync(dirname);
    return true;
  }
}

/**
 * 同步移动文件
 * @param  {string} sourceFile 来源文件地址
 * @param  {string} destPath 目标文件地址
 * @return {Promise} 移动结果
 */
export function fsRename(sourceFile, destPath) {
  return fs.renameSync(sourceFile, destPath);
}

// 删除文件
export function fsDel(sourceFile) {
  return fs.unlinkSync(sourceFile);
}
