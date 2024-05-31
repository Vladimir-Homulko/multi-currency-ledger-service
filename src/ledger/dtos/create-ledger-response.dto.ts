import { ApiProperty } from '@nestjs/swagger';
import { Balance } from '../../balance/entities/balance.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { CreateTransactionResponseDto } from '../../transaction/dtos/create-transaction-response.dto';
import { CreateBalanceResponseDto } from '../../balance/dtos/create-balance-response.dto';

export class CreateLedgerResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: '2024-05-30T16:53:30.123Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-05-30T16:53:30.123Z' })
  updatedAt: Date;

  @ApiProperty({ type: [CreateTransactionResponseDto] })
  transactions: Transaction[];

  @ApiProperty({ type: [CreateBalanceResponseDto] })
  balances: Balance[];
}
