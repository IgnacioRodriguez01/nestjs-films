import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/auth.dto';
import { Role } from '../../common/enums/role.enum';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockUser = {
  _id: 'someId',
  email: 'test@example.com',
  password: 'hashedPassword',
  role: Role.USER,
  toObject: () => mockUser,
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneWithoutFail: jest.fn(),
            create: jest.fn(),
            findOneOrFail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = { name: 'New User', email: 'new@example.com', password: 'password' };
      jest.spyOn(usersService, 'findOneWithoutFail').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser as any);

      const result = await service.register(registerDto);
      expect(result).toEqual(mockUser);
      expect(usersService.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user already exists', async () => {
      const registerDto: RegisterDto = { name: 'Test User', email: 'test@example.com', password: 'password' };
      jest.spyOn(usersService, 'findOneWithoutFail').mockResolvedValue(mockUser as any);

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { email: 'test@example.com', _id: 'someId', role: Role.USER };
      const token = 'someAccessToken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.login(user);
      expect(result).toEqual({ access_token: token });
      expect(jwtService.sign).toHaveBeenCalledWith({ email: user.email, sub: user._id, role: user.role });
    });
  });

  describe('validateUser', () => {
    it('should return user if validation is successful', async () => {
      jest.spyOn(usersService, 'findOneOrFail').mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const { password, ...expectedUser } = mockUser;
      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual(expectedUser);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(usersService, 'findOneOrFail').mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser('test@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });
  });
});
