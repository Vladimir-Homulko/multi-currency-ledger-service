import { IsEnum, IsNotEmpty } from 'class-validator';
import { Currency } from '../../common';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLedgerDto {
  @ApiProperty({
    enum: Currency,
  })
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;
}
