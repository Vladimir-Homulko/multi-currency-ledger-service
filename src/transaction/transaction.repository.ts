import { BaseRepository } from '../common';
import { DataSource } from 'typeorm';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Transaction } from './entities/transaction.entity';

@Injectable({ scope: Scope.REQUEST })
export class TransactionRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  public async save(transaction: Transaction): Promise<Transaction> {
    return this.getRepository(Transaction).save(transaction);
  }
}
