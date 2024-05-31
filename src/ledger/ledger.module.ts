import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerService } from './ledger.service';
import { LedgerController } from './ledger.controller';
import { Ledger } from './entities/ledger.entity';
import { LedgerRepository } from './ledger.repository';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ledger]),
    forwardRef(() => BalanceModule),
  ],
  controllers: [LedgerController],
  providers: [LedgerService, LedgerRepository],
  exports: [LedgerService],
})
export class LedgerModule {}
