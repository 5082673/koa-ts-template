import { prop, modelOptions } from '@typegoose/typegoose';

class BaseEntity {
  // @prop({ required: true })
  // public id?: chatList;
  @prop({ required: true, default: new Date().getTime() })
  public createTime?: number;
  @prop({ required: true, default: new Date().getTime() })
  public updateTime?: number;
}

@modelOptions({
  options: {
    customName: '接口请求日志',
    automaticName: false,
  },
  schemaOptions: {
    collection: 'apiRequestLog',
    timestamps: false,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;

        ret.header = JSON.parse(ret.header || '{}');
        ret.body = JSON.parse(ret.body || '{}');
        ret.query = JSON.parse(ret.query || '{}');
        ret.returnBody = JSON.parse(ret.returnBody || '{}');
      },
    },
  },
})
export class apiRequestLog extends BaseEntity {
  @prop({ text: '请求头', required: true })
  header: string;

  @prop({ text: '请求form参数体', required: true })
  body: string;

  @prop({ text: '请求url参数体', required: true })
  query: string;

  @prop({ text: '请求方式', required: true })
  method: string;

  @prop({ text: '响应参数', required: true })
  returnBody: string;

  @prop({ text: '接口消耗时间', required: true })
  timeConsuming: number;

  @prop({ text: '请求接口', required: true })
  api: string;

  @prop({ text: '请求域名', required: true })
  host: string;

  @prop({ text: '请求ip', required: true })
  ip: string;
}
