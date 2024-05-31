import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { LedgerModule } from '../ledger/ledger.module';
import { Transaction } from './entities/transaction.entity';
import { BalanceModule } from '../balance/balance.module';
import { TransactionRepository } from "./transaction.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    LedgerModule,
    BalanceModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
