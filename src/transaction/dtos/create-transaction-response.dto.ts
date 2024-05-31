import { ApiProperty } from '@nestjs/swagger';
import { Ledger } from '../../ledger/entities/ledger.entity';
import { Currency, TransactionTypes } from '../../common';
import { CreateLedgerResponseDto } from '../../ledger/dtos/create-ledger-response.dto';

export class CreateTransactionResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ type: () => CreateLedgerResponseDto })
  ledger: Ledger;

  @ApiProperty({ enum: TransactionTypes, example: TransactionTypes.DEBIT })
  transactionType: TransactionTypes;

  @ApiProperty({ example: 100.0 })
  amount: number;

  @ApiProperty({ enum: Currency, example: Currency.USD })
  currency: Currency;

  @ApiProperty({ example: '2024-05-30T16:53:30.123Z' })
  createdAt: Date;
}
