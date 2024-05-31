import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ledger } from '../../ledger/entities/ledger.entity';
import { Currency, TransactionTypes } from '../../common';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Ledger, (ledger) => ledger.transactions)
  @JoinColumn({ name: 'ledger_id' })
  ledger: Ledger;

  @Column({ name: 'transaction_type', type: 'enum', enum: TransactionTypes })
  transactionType: TransactionTypes;

  @Column({ type: 'numeric' })
  amount: number;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
