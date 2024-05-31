import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Balance } from './entities/balance.entity';
import { CreateBalanceDto } from './dtos/create-balance.dto';
import { BalanceRepository } from './balance.repository';
import { LedgerService } from '../ledger/ledger.service';
import { TransactionTypes } from '../common';
import Big from 'big.js';

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);

  constructor(
    private readonly balanceRepository: BalanceRepository,
    @Inject(forwardRef(() => LedgerService))
    private readonly ledgerService: LedgerService,
  ) {}

  public async createBalance(
    createBalanceDto: CreateBalanceDto,
  ): Promise<Balance> {
    const { ledgerId, currency } = createBalanceDto;
    const balance = new Balance();
    balance.currency = currency;

    if (ledgerId) {
      this.logger.log(`Finding ledger with ID ${ledgerId}`);
      const ledger = await this.ledgerService.findById(ledgerId);

      if (!ledger) {
        this.logger.warn(`Ledger with ID ${ledgerId} not found`);
        throw new NotFoundException('Ledger not found');
      }

      if (ledger.balances.find((balance) => balance.currency === currency)) {
        this.logger.warn(
          `Balance with currency ${currency} already exists for ledger ID ${ledgerId}`,
        );
        throw new BadRequestException('Balance with this currency exists');
      }

      balance.ledger = ledger;
    }

    this.logger.log(
      `Creating balance with currency ${currency} for ledger ID ${ledgerId}`,
    );
    return this.balanceRepository.save(balance);
  }

  public async updateBalance(
    balance: Balance,
    amount: number,
    transactionType: TransactionTypes,
  ): Promise<Balance> {
    const currentAmount = balance.amount;
    const transactionAmount = amount;

    this.logger.log(
      `Updating balance ID ${balance.id} with transaction amount ${transactionAmount} of type ${transactionType}`,
    );

    if (transactionType === TransactionTypes.DEBIT) {
      if (currentAmount < transactionAmount) {
        this.logger.warn(`Insufficient funds for balance ID ${balance.id}`);
        throw new BadRequestException('Insufficient funds');
      }
      balance.amount = new Big(currentAmount)
        .minus(transactionAmount)
        .toNumber();
    } else if (transactionType === TransactionTypes.CREDIT) {
      balance.amount = new Big(currentAmount)
        .plus(transactionAmount)
        .toNumber();
    } else {
      this.logger.warn(
        `Invalid transaction type ${transactionType} for balance ID ${balance.id}`,
      );
      throw new BadRequestException('Invalid transaction type');
    }

    this.logger.log(`Balance ID ${balance.id} updated successfully`);
    return this.balanceRepository.save(balance);
  }

  public async getBalancesByLedgerId(ledgerId: string): Promise<Balance[]> {
    this.logger.log(`Retrieving balances for ledger ID ${ledgerId}`);
    return this.balanceRepository.getBalancesByLedgerId(ledgerId);
  }
}
