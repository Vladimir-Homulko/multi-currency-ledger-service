import { BaseRepository } from '../common';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { DataSource, FindOneOptions } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Balance } from '../balance/entities/balance.entity';
import { Ledger } from './entities/ledger.entity';

@Injectable({ scope: Scope.REQUEST })
export class LedgerRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  public async save(balance: Balance): Promise<Ledger> {
    return this.getRepository(Ledger).save({
      balances: [balance],
    });
  }

  public async findOne(options: FindOneOptions<Ledger>): Promise<Ledger> {
    return this.getRepository(Ledger).findOne(options);
  }
}
