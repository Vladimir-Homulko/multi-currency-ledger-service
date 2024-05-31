import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionInterceptor } from '../common';
import { Transaction } from './entities/transaction.entity';
import { ErrorResponseDto } from '../common/error/error-response.dto';
import { CreateTransactionResponseDto } from "./dtos/create-transaction-response.dto";

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Create transaction' })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created.',
    type: CreateTransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: ErrorResponseDto,
  })
  public async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(createTransactionDto);
  }
}
