import { ApiProperty, PickType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsString } from "class-validator";
import { Role } from "src/common/enums/role.enum";

export class RegisterDto {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'John Doe' })
    name: string;

    @Expose()
    @IsEmail()
    @ApiProperty({ example: 'johndoe@example.com' })
    email: string;

    @IsString()
    @ApiProperty({ example: 'password123' })
    password: string;
}

const propertiesRegisterResponse: (keyof RegisterDto)[] = ['name', 'email'];
export class RegisterResponseDto extends PickType(RegisterDto, propertiesRegisterResponse) {
    @Exclude()
    @ApiProperty({ example: 'password123' })
    password: string;

    @Expose()
    @ApiProperty({ example: 'USER' })
    role: Role;
}

export class LoginDto {
    @IsEmail()
    @ApiProperty({ example: 'johndoe@example.com' })
    email: string;

    @IsString()
    @ApiProperty({ example: 'password123' })
    password: string;
}

export class LoginResponseDto {
    @Expose()
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    accessToken: string;
}
