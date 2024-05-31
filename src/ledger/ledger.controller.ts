import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LedgerService } from './ledger.service';
import { CreateLedgerDto } from './dtos/create-ledger.dto';
import { Ledger } from './entities/ledger.entity';
import { TransactionInterceptor } from '../common';
import { ErrorResponseDto } from '../common/error/error-response.dto';
import { CreateLedgerResponseDto } from "./dtos/create-ledger-response.dto";

@ApiTags('Ledgers')
@Controller('ledgers')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Create ledger' })
  @ApiResponse({
    status: 201,
    description: 'The ledger has been successfully created.',
    type: CreateLedgerResponseDto,
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
  public async createLedger(
    @Body() createLedgerDto: CreateLedgerDto,
  ): Promise<Ledger> {
    return this.ledgerService.createLedger(createLedgerDto);
  }
}
