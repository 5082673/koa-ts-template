import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 13,
    default: Number(new Date().getTime()),
    comment: '创建时间戳',
  })
  create_time?: number;

  @Column({
    type: 'varchar',
    length: 13,
    default: Number(new Date().getTime()),
    comment: '修改时间戳',
  })
  update_time?: number;
}
