import { ApiProperty } from '@nestjs/swagger';
import { CreateBalanceResponseDto } from './create-balance-response.dto';

export class GetBalancesByLedgerResponseDto {
  @ApiProperty({ type: [CreateBalanceResponseDto] })
  balances: CreateBalanceResponseDto[];
}
