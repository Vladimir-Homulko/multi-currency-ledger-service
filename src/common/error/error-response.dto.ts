import { ApiProperty } from '@nestjs/swagger';

class ValidationError {
  @ApiProperty()
  message: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Error message' })
  message: string;

  @ApiProperty({ type: [ValidationError], nullable: true })
  errors: ValidationError[] | null;
}
