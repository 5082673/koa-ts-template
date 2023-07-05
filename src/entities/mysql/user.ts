import { Entity, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'user_entity' })
export default class User extends BaseEntity {
  @Column({ default: '', comment: '姓名' })
  name: string;

  @Column({ default: '', comment: '描述信息' })
  description: string;

  @Column({ default: '', comment: '上传文件' })
  filename: string;

  @Column({ type: 'varchar', default: 0, length: 1 })
  views: number;

  @Column({ type: 'varchar', default: 0, length: 1 })
  isPublished: number;
}
