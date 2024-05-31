import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { Balance } from '../../balance/entities/balance.entity';

@Entity('ledgers')
export class Ledger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.ledger)
  transactions: Transaction[];

  @OneToMany(() => Balance, (balance) => balance.ledger)
  balances: Balance[];
}
