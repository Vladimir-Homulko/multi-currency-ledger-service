import { TransactionService } from '../transaction.service';
import { TransactionRepository } from '../transaction.repository';
import { LedgerService } from '../../ledger/ledger.service';
import { BalanceService } from '../../balance/balance.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { Currency, TransactionTypes } from '../../common';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepository: TransactionRepository;
  let ledgerService: LedgerService;
  let balanceService: BalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: LedgerService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: BalanceService,
          useValue: {
            updateBalance: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
    ledgerService = module.get<LedgerService>(LedgerService);
    balanceService = module.get<BalanceService>(BalanceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('should throw NotFoundException if ledger is not found', async () => {
      const createTransactionDto: CreateTransactionDto = {
        ledgerId: 'invalid-id',
        currency: Currency.USD,
        amount: 100,
        transactionType: TransactionTypes.DEBIT,
      };

      jest.spyOn(ledgerService, 'findById').mockResolvedValue(null);

      await expect(
        service.createTransaction(createTransactionDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if balance with the specified currency is not found', async () => {
      const createTransactionDto: CreateTransactionDto = {
        ledgerId: 'valid-id',
        currency: Currency.USD,
        amount: 100,
        transactionType: TransactionTypes.DEBIT,
      };

      const ledger = { id: 'valid-id', balances: [] } as any;
      jest.spyOn(ledgerService, 'findById').mockResolvedValue(ledger);

      await expect(
        service.createTransaction(createTransactionDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create a transaction and update the balance', async () => {
      const createTransactionDto: CreateTransactionDto = {
        ledgerId: 'valid-id',
        currency: Currency.USD,
        amount: 100,
        transactionType: TransactionTypes.DEBIT,
      };

      const balance = { currency: 'USD', amount: 200 } as any;
      const ledger = { id: 'valid-id', balances: [balance] } as any;
      const savedTransaction = {
        ...createTransactionDto,
        id: '1',
        ledger,
      } as unknown as Transaction;

      jest.spyOn(ledgerService, 'findById').mockResolvedValue(ledger);
      jest.spyOn(balanceService, 'updateBalance').mockResolvedValue(balance);
      jest
        .spyOn(transactionRepository, 'save')
        .mockResolvedValue(savedTransaction);

      const result = await service.createTransaction(createTransactionDto);

      expect(result).toEqual(savedTransaction);
      expect(balanceService.updateBalance).toHaveBeenCalledWith(
        balance,
        createTransactionDto.amount,
        createTransactionDto.transactionType,
      );
      expect(transactionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: createTransactionDto.amount,
          transactionType: createTransactionDto.transactionType,
          currency: createTransactionDto.currency,
          ledger,
        }),
      );
    });
  });
});
