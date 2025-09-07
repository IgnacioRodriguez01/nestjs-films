import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { RegisterDto, LoginDto, RegisterResponseDto, LoginResponseDto } from './dto/auth.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ type: RegisterResponseDto })
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto })
    async register(@Body() registerDto: RegisterDto) {
        const user = await this.authService.register(registerDto);
        return plainToInstance(RegisterResponseDto, user, {
            excludeExtraneousValues: true,
          })
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: LoginResponseDto })
    @ApiBody({ type: LoginDto })
    @ApiOperation({ summary: 'Login with email and password' })
    async login(@Request() req) {
        const login = await this.authService.login(req.user);
        return plainToInstance(LoginResponseDto, login)
    }

    @Roles(Role.ADMIN)
    @Post('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: RegisterResponseDto })
    @ApiOperation({ summary: 'Create an admin user' })
    @HttpCode(HttpStatus.CREATED)
    async createAdmin(@Body() registerDto: RegisterDto) {
        const user = await this.authService.register(registerDto, Role.ADMIN);
        return plainToInstance(RegisterResponseDto, user, {
            excludeExtraneousValues: true,
          })
    }
}
