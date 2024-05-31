import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { LedgerService } from '../ledger/ledger.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionRepository } from './transaction.repository';
import { BalanceService } from '../balance/balance.service';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private transactionRepository: TransactionRepository,
    private readonly ledgerService: LedgerService,
    private readonly balanceService: BalanceService,
  ) {}

  public async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const { ledgerId, currency, amount, transactionType } =
      createTransactionDto;

    this.logger.log(
      `Creating transaction for ledger ID ${ledgerId} with amount ${amount} and type ${transactionType}`,
    );

    const ledger = await this.ledgerService.findById(ledgerId);

    if (!ledger) {
      this.logger.warn(`Ledger with ID ${ledgerId} not found`);
      throw new NotFoundException('Ledger not found');
    }

    const balance = ledger.balances.find(
      (balance) => balance.currency === currency,
    );

    if (!balance) {
      this.logger.warn(
        `Balance with currency ${currency} not found for ledger ID ${ledgerId}`,
      );
      throw new BadRequestException('This ledger not support this currency');
    }

    await this.balanceService.updateBalance(balance, amount, transactionType);

    const transaction = new Transaction();
    transaction.amount = amount;
    transaction.transactionType = transactionType;
    transaction.currency = currency;
    transaction.ledger = ledger;

    const savedTransaction = await this.transactionRepository.save(transaction);

    this.logger.log(
      `Transaction created with ID ${savedTransaction.id} for ledger ID ${ledgerId}`,
    );
    return savedTransaction;
  }
}
