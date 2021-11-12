import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PasswordResetDto {

  @ApiProperty({
    example: 'valid@email.com',
    description: 'Field to e-mail',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;

}
