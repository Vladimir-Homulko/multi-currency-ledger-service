import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { Currency, TransactionTypes } from '../../common';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  ledgerId: string;

  @ApiProperty({
    enum: TransactionTypes,
  })
  @IsNotEmpty()
  @IsEnum(TransactionTypes)
  transactionType: TransactionTypes;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    enum: Currency,
  })
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;
}
