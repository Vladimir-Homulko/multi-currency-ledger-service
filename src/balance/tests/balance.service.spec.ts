import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from '../balance.service';
import { BalanceRepository } from '../balance.repository';
import { LedgerService } from '../../ledger/ledger.service';
import { CreateBalanceDto } from '../dtos/create-balance.dto';
import { Currency, TransactionTypes } from '../../common';
import { Balance } from '../entities/balance.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BalanceService', () => {
  let service: BalanceService;
  let balanceRepository: BalanceRepository;
  let ledgerService: LedgerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        {
          provide: BalanceRepository,
          useValue: {
            save: jest.fn(),
            getBalancesByLedgerId: jest.fn(),
          },
        },
        {
          provide: LedgerService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
    balanceRepository = module.get<BalanceRepository>(BalanceRepository);
    ledgerService = module.get<LedgerService>(LedgerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBalance', () => {
    it('should create a balance without ledgerId', async () => {
      const createBalanceDto: CreateBalanceDto = {
        currency: Currency.USD,
      };

      const savedBalance = { ...createBalanceDto, id: '1' } as Balance;
      jest.spyOn(balanceRepository, 'save').mockResolvedValue(savedBalance);

      expect(await service.createBalance(createBalanceDto)).toEqual(
        savedBalance,
      );
      expect(balanceRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(createBalanceDto),
      );
    });

    it('should throw NotFoundException if ledger is not found', async () => {
      const createBalanceDto: CreateBalanceDto = {
        ledgerId: '1',
        currency: Currency.USD,
      };

      jest.spyOn(ledgerService, 'findById').mockResolvedValue(null);

      await expect(service.createBalance(createBalanceDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if balance with this currency exists', async () => {
      const createBalanceDto: CreateBalanceDto = {
        ledgerId: '1',
        currency: Currency.USD,
      };

      const ledger = { id: '1', balances: [{ currency: Currency.USD }] } as any;
      jest.spyOn(ledgerService, 'findById').mockResolvedValue(ledger);

      await expect(service.createBalance(createBalanceDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a balance with ledgerId', async () => {
      const createBalanceDto: CreateBalanceDto = {
        ledgerId: '1',
        currency: Currency.USD,
      };

      const ledger = { id: '1', balances: [] } as any;
      jest.spyOn(ledgerService, 'findById').mockResolvedValue(ledger);

      const savedBalance = { ...createBalanceDto, id: '1', ledger } as Balance;
      jest.spyOn(balanceRepository, 'save').mockResolvedValue(savedBalance);

      expect(await service.createBalance(createBalanceDto)).toEqual(
        savedBalance,
      );
    });
  });

  describe('updateBalance', () => {
    it('should update balance for debit transaction', async () => {
      const balance = { amount: 100 } as Balance;
      const updatedBalance = { ...balance, amount: 90 } as Balance;

      jest.spyOn(balanceRepository, 'save').mockResolvedValue(updatedBalance);

      expect(
        await service.updateBalance(balance, 10, TransactionTypes.DEBIT),
      ).toEqual(updatedBalance);
      expect(balanceRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 90 }),
      );
    });

    it('should throw BadRequestException for insufficient funds on debit transaction', async () => {
      const balance = { amount: 100 } as Balance;

      await expect(
        service.updateBalance(balance, 110, TransactionTypes.DEBIT),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update balance for credit transaction', async () => {
      const balance = { amount: 100 } as Balance;
      const updatedBalance = { ...balance, amount: 110 } as Balance;

      jest.spyOn(balanceRepository, 'save').mockResolvedValue(updatedBalance);

      expect(
        await service.updateBalance(balance, 10, TransactionTypes.CREDIT),
      ).toEqual(updatedBalance);
      expect(balanceRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 110 }),
      );
    });

    it('should throw BadRequestException for invalid transaction type', async () => {
      const balance = { amount: 100 } as Balance;

      await expect(
        service.updateBalance(balance, 10, 'INVALID' as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getBalancesByLedgerId', () => {
    it('should return balances for given ledgerId', async () => {
      const balances = [
        { currency: Currency.USD },
        { currency: Currency.EUR },
      ] as Balance[];
      jest
        .spyOn(balanceRepository, 'getBalancesByLedgerId')
        .mockResolvedValue(balances);

      expect(await service.getBalancesByLedgerId('1')).toEqual(balances);
      expect(balanceRepository.getBalancesByLedgerId).toHaveBeenCalledWith('1');
    });
  });
});
