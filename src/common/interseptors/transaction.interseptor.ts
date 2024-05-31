import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { ENTITY_MANAGER_KEY } from '../constants';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TransactionInterceptor.name);

  constructor(private dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    req[ENTITY_MANAGER_KEY] = queryRunner.manager;

    const requestId = req.headers['x-request-id'] || uuidv4();
    this.logger.log(`Transaction started | Request ID: ${requestId}`);

    try {
      const result = await next.handle().toPromise();
      await queryRunner.commitTransaction();
      this.logger.log(`Transaction committed | Request ID: ${requestId}`);
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Transaction rolled back | Request ID: ${requestId}`,
        error.stack,
      );
      throw error;
    } finally {
      await queryRunner.release();
      this.logger.log(`Transaction released | Request ID: ${requestId}`);
    }
  }
}
