import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Currency } from '../../common';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBalanceDto {
  @ApiProperty({
    enum: Currency,
  })
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  ledgerId?: string;
}
