import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { BalanceService } from '../balance/balance.service';
import { CreateLedgerDto } from './dtos/create-ledger.dto';
import { LedgerRepository } from './ledger.repository';
import { Ledger } from './entities/ledger.entity';

@Injectable()
export class LedgerService {
  private readonly logger = new Logger(LedgerService.name);

  constructor(
    private readonly ledgerRepository: LedgerRepository,
    @Inject(forwardRef(() => BalanceService))
    private readonly balanceService: BalanceService,
  ) {}

  public async createLedger({ currency }: CreateLedgerDto) {
    this.logger.log(`Creating a ledger with initial currency ${currency}`);

    const balance = await this.balanceService.createBalance({
      currency,
    });

    const ledger = await this.ledgerRepository.save(balance);

    this.logger.log(`Ledger created with ID ${ledger.id}`);
    return ledger;
  }

  public async findById(ledgerId: string): Promise<Ledger> {
    return this.ledgerRepository.findOne({
      where: { id: ledgerId },
      relations: ['balances'],
    });
  }
}
