import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class DummyCreateDto {

  @ApiProperty({
    example: 'Description example',
    description: 'Field to description anything',
  })

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  description: string;
}
