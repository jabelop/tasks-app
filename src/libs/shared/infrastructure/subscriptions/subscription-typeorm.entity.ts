import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserTypeOrm } from 'src/libs/shared/infrastructure/users/entity/user-typeorm.entity';

@Entity('subscriptions')
export class SubscriptionTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column()
  price: number;

  @Column()
  maxTasks: number;

  @Column()
  rateLimited: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => UserTypeOrm, (user) => user.subscription)
  @JoinTable()
  users?: UserTypeOrm[];
}
