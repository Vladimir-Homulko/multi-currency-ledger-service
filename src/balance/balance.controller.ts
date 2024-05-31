import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dtos/create-balance.dto';
import { Balance } from './entities/balance.entity';
import { ErrorResponseDto } from '../common/error/error-response.dto';
import { CreateBalanceResponseDto } from './dtos/create-balance-response.dto';
import { GetBalancesByLedgerResponseDto } from './dtos/get-balances-by-ledger-id-response.dto';

@ApiTags('Balances')
@Controller('balances')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create balance' })
  @ApiResponse({
    status: 201,
    description: 'The balance has been successfully created.',
    type: CreateBalanceResponseDto,
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
  public async createBalance(
    @Body() createBalanceDto: CreateBalanceDto,
  ): Promise<Balance> {
    return this.balanceService.createBalance(createBalanceDto);
  }

  @Get(':ledgerId')
  @ApiOperation({ summary: 'Get balances by ledger ID' })
  @ApiResponse({
    status: 200,
    description: 'Return balances by ledger ID.',
    type: GetBalancesByLedgerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    type: ErrorResponseDto,
  })
  public async getBalancesByLedger(
    @Param('ledgerId', ParseUUIDPipe) ledgerId: string,
  ): Promise<Balance[]> {
    return this.balanceService.getBalancesByLedgerId(ledgerId);
  }
}
