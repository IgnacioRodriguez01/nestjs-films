import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RegisterDto } from './dto/auth.dto';
import { Role } from '../../common/enums/role.enum';

const mockUser = {
  _id: 'someId',
  name: 'Test User',
  email: 'test@example.com',
  role: Role.USER,
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue(mockUser),
            login: jest.fn().mockResolvedValue({ accessToken: 'someToken' }),
          },
        },
      ],
    })
    .overrideGuard(LocalAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const registerDto: RegisterDto = { name: 'Test User', email: 'test@example.com', password: 'password' };
      const result = await controller.register(registerDto);
      expect(service.register).toHaveBeenCalledWith(registerDto);
      expect(result).toBeInstanceOf(Object);
    });
  });

  describe('login', () => {
    it('should login a user and return an access token', async () => {
      const req = { user: mockUser };
      const result = await controller.login(req);
      expect(service.login).toHaveBeenCalledWith(req.user);
      expect(result).toBeInstanceOf(Object);
    });
  });

  describe('createAdmin', () => {
    it('should create an admin user', async () => {
      const registerDto: RegisterDto = { name: 'Admin User', email: 'admin@example.com', password: 'password' };
      const result = await controller.createAdmin(registerDto);
      expect(service.register).toHaveBeenCalledWith(registerDto, Role.ADMIN);
      expect(result).toBeInstanceOf(Object);
    });
  });
});
