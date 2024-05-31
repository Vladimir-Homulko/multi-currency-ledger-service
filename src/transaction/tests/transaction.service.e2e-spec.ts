import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { Currency, TransactionTypes } from '../../common';
import { connectionSource } from '../../config/typeorm.config';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    await connectionSource.initialize();
    await dataSource.runMigrations();
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  describe('/POST transaction', () => {
    let ledgerId: string;

    beforeAll(async () => {
      const createLedgerDto = {
        currency: Currency.USD,
      };

      const { body: ledger } = await request(app.getHttpServer())
        .post('/ledger')
        .send(createLedgerDto)
        .expect(201);

      ledgerId = ledger.id;

      const createBalanceDto = {
        ledgerId,
        currency: Currency.USD,
      };

      await request(app.getHttpServer())
        .post('/balance')
        .send(createBalanceDto)
        .expect(201);
    });

    it('should create a transaction and update the balance', async () => {
      const createTransactionDto: CreateTransactionDto = {
        ledgerId,
        currency: Currency.USD,
        amount: 100,
        transactionType: TransactionTypes.CREDIT,
      };

      return request(app.getHttpServer())
        .post('/transaction')
        .send(createTransactionDto)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.ledger.id).toEqual(ledgerId);
          expect(response.body.amount).toEqual(createTransactionDto.amount);
          expect(response.body.transactionType).toEqual(
            createTransactionDto.transactionType,
          );
          expect(response.body.currency).toEqual(createTransactionDto.currency);
        });
    });

    it('should return 404 if ledger is not found', async () => {
      const createTransactionDto: CreateTransactionDto = {
        ledgerId: 'invalid-id',
        currency: Currency.USD,
        amount: 100,
        transactionType: TransactionTypes.DEBIT,
      };

      return request(app.getHttpServer())
        .post('/transaction')
        .send(createTransactionDto)
        .expect(404);
    });

    it('should return 400 if balance with the specified currency is not found', async () => {
      const createTransactionDto: CreateTransactionDto = {
        ledgerId,
        currency: Currency.EUR,
        amount: 100,
        transactionType: TransactionTypes.DEBIT,
      };

      return request(app.getHttpServer())
        .post('/transaction')
        .send(createTransactionDto)
        .expect(400);
    });

    it('should return 400 for insufficient funds on debit transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        ledgerId,
        currency: Currency.USD,
        amount: 1000,
        transactionType: TransactionTypes.DEBIT,
      };

      return request(app.getHttpServer())
        .post('/transaction')
        .send(createTransactionDto)
        .expect(400);
    });
  });
});
