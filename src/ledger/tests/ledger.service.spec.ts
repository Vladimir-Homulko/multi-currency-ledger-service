import { Test, TestingModule } from '@nestjs/testing';
import { LedgerService } from '../ledger.service';
import { LedgerRepository } from '../ledger.repository';
import { BalanceService } from '../../balance/balance.service';
import { CreateLedgerDto } from '../dtos/create-ledger.dto';
import { Currency } from '../../common';

describe('LedgerService', () => {
  let ledgerService: LedgerService;
  let ledgerRepository: jest.Mocked<LedgerRepository>;
  let balanceService: jest.Mocked<BalanceService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LedgerService,
        {
          provide: LedgerRepository,
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: BalanceService,
          useValue: {
            createBalance: jest.fn(),
          },
        },
      ],
    }).compile();

    ledgerService = module.get<LedgerService>(LedgerService);
    ledgerRepository = module.get<
      LedgerRepository,
      jest.Mocked<LedgerRepository>
    >(LedgerRepository);
    balanceService = module.get<BalanceService, jest.Mocked<BalanceService>>(
      BalanceService,
    );
  });

  it('should be defined', () => {
    expect(ledgerService).toBeDefined();
  });

  describe('createLedger', () => {
    it('should create a new ledger with balance', async () => {
      const createLedgerDto: CreateLedgerDto = { currency: Currency.USD };
      const mockBalance = { id: 'balance-id', currency: Currency.USD };
      const mockLedger = { id: 'ledger-id', balances: [mockBalance] };

      balanceService.createBalance.mockResolvedValue(mockBalance as any);
      ledgerRepository.save.mockResolvedValue(mockLedger as any);

      const result = await ledgerService.createLedger(createLedgerDto);

      expect(balanceService.createBalance).toHaveBeenCalledWith({
        currency: Currency.USD,
      });
      expect(ledgerRepository.save).toHaveBeenCalledWith(mockBalance);
      expect(result).toEqual(mockLedger);
    });
  });

  describe('findById', () => {
    it('should return a ledger by id', async () => {
      const mockLedger = { id: 'ledger-id', balances: [] };

      ledgerRepository.findOne.mockResolvedValue(mockLedger as any);

      const result = await ledgerService.findById('ledger-id');

      expect(ledgerRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'ledger-id' },
        relations: ['balances'],
      });
      expect(result).toEqual(mockLedger);
    });
  });
});
