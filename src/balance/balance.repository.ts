import { Inject, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '../common';
import { Balance } from './entities/balance.entity';

@Injectable({ scope: Scope.REQUEST })
export class BalanceRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  public async save(balance: Balance): Promise<Balance> {
    return this.getRepository(Balance).save(balance);
  }

  public async getBalancesByLedgerId(ledgerId: string): Promise<Balance[]> {
    return this.getRepository(Balance).find({
      where: { ledger: { id: ledgerId } },
    });
  }
}
