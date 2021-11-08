import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserCreateDto {

  @ApiProperty({
    example: 'Name example',
    description: 'Field to user name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'valid@email.com',
    description: 'Field to e-mail',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '!@#$%&*()123abc',
    description: 'Field to password',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  password: string;
}
