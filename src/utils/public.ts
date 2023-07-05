import { PublicType } from './types';

export function success({
  msg = '请求成功',
  data = '',
  extend,
  code = 0,
}: PublicType.apiProps): PublicType.apiProps {
  return {
    code,
    msg,
    data,
    extend,
  };
}

export function error({
  msg = '请求失败',
  data = '',
  extend,
  code = -1,
}: PublicType.apiProps): PublicType.apiProps {
  return {
    code,
    msg,
    data,
    extend,
  };
}
