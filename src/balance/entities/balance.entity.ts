import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Ledger } from '../../ledger/entities/ledger.entity';
import { Currency } from '../../common';
import { JoinColumn } from 'typeorm';

@Entity('balances')
export class Balance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Ledger, (ledger) => ledger.balances)
  @JoinColumn({ name: 'ledger_id' })
  ledger: Ledger;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  @Column({ type: 'numeric', default: 0 })
  amount: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
