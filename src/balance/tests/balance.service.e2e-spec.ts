import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { CreateBalanceDto } from '../dtos/create-balance.dto';
import { Currency, TransactionTypes } from '../../common';
import Big from 'big.js';
import { connectionSource } from '../../config/typeorm.config';

describe('BalanceController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = connectionSource;
    await connectionSource.initialize();
    await connectionSource.runMigrations();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('/POST balance', () => {
    it('should create a balance without ledgerId', async () => {
      const createBalanceDto: CreateBalanceDto = {
        currency: Currency.USD,
      };

      return request(app.getHttpServer())
        .post('/balance')
        .send(createBalanceDto)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.currency).toEqual(createBalanceDto.currency);
        });
    });

    it('should return 404 if ledger not found', async () => {
      const createBalanceDto: CreateBalanceDto = {
        ledgerId: 'invalid-id',
        currency: Currency.USD,
      };

      return request(app.getHttpServer())
        .post('/balance')
        .send(createBalanceDto)
        .expect(404);
    });

    it('should return 400 if balance with this currency exists', async () => {
      const createBalanceDto: CreateBalanceDto = {
        ledgerId: 'valid-id',
        currency: Currency.USD,
      };

      // Создаем баланс
      await request(app.getHttpServer())
        .post('/balance')
        .send(createBalanceDto)
        .expect(201);

      // Пытаемся создать еще один баланс с той же валютой
      return request(app.getHttpServer())
        .post('/balance')
        .send(createBalanceDto)
        .expect(400);
    });
  });

  describe('/PATCH balance', () => {
    it('should update balance for debit transaction', async () => {
      const createBalanceDto: CreateBalanceDto = {
        currency: Currency.USD,
      };

      const { body: balance } = await request(app.getHttpServer())
        .post('/balance')
        .send(createBalanceDto)
        .expect(201);

      return request(app.getHttpServer())
        .patch(`/balance/${balance.id}`)
        .send({
          amount: 10,
          transactionType: TransactionTypes.DEBIT,
        })
        .expect(200)
        .expect((response) => {
          expect(response.body.amount).toEqual(
            new Big(balance.amount).minus(10).toNumber(),
          );
        });
    });

    it('should return 400 for insufficient funds on debit transaction', async () => {
      const createBalanceDto: CreateBalanceDto = {
        currency: Currency.USD,
      };

      const { body: balance } = await request(app.getHttpServer())
        .post('/balance')
        .send(createBalanceDto)
        .expect(201);

      return request(app.getHttpServer())
        .patch(`/balance/${balance.id}`)
        .send({
          amount: 110,
          transactionType: TransactionTypes.DEBIT,
        })
        .expect(400);
    });

    it('should update balance for credit transaction', async () => {
      const createBalanceDto: CreateBalanceDto = {
        currency: Currency.USD,
      };

      const { body: balance } = await request(app.getHttpServer())
        .post('/balance')
        .send(createBalanceDto)
        .expect(201);

      return request(app.getHttpServer())
        .patch(`/balance/${balance.id}`)
        .send({
          amount: 10,
          transactionType: TransactionTypes.CREDIT,
        })
        .expect(200)
        .expect((response) => {
          expect(response.body.amount).toEqual(
            new Big(balance.amount).plus(10).toNumber(),
          );
        });
    });
  });

  describe('/GET balances by ledgerId', () => {
    it('should return balances for given ledgerId', async () => {
      const createLedgerDto = {
        currency: Currency.USD,
      };

      const { body: ledger } = await request(app.getHttpServer())
        .post('/ledger')
        .send(createLedgerDto)
        .expect(201);

      const { body: balance } = await request(app.getHttpServer())
        .post('/balance')
        .send({
          ledgerId: ledger.id,
          currency: Currency.USD,
        })
        .expect(201);

      return request(app.getHttpServer())
        .get(`/balance/ledger/${ledger.id}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toEqual([balance]);
        });
    });
  });
});
