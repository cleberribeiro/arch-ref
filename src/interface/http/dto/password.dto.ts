import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PasswordDto {

  @ApiProperty({
    example: '!@#$%&*()123abc',
    description: 'Field to password',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  password: string;

}
