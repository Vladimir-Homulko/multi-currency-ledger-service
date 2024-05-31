import { ApiProperty } from '@nestjs/swagger';
import { Ledger } from '../../ledger/entities/ledger.entity';
import { Currency } from '../../common';
import { CreateLedgerResponseDto } from '../../ledger/dtos/create-ledger-response.dto';

export class CreateBalanceResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ type: () => CreateLedgerResponseDto })
  ledger: Ledger;

  @ApiProperty({ enum: Currency, example: Currency.USD })
  currency: Currency;

  @ApiProperty({ example: 100.0 })
  amount: number;

  @ApiProperty({ example: '2024-05-30T16:53:30.123Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-05-30T16:53:30.123Z' })
  updatedAt: Date;
}
