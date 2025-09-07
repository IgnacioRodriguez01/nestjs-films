import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './repository/users.repository';
import { User } from './schema/user.schema';
import { Role } from '../../common/enums/role.enum';

import { Types } from 'mongoose';

const mockUser: User = {
  _id: new Types.ObjectId(),
  name: 'Test User',
  email: 'test@example.com',
  password: 'password',
  role: Role.USER,
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockUser]),
            findOneOrFail: jest.fn().mockResolvedValue(mockUser),
            findOneWithoutFail: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll();
      expect(users).toEqual([mockUser]);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOneOrFail', () => {
    it('should return a single user', async () => {
      const user = await service.findOneOrFail({ email: 'test@example.com' });
      expect(user).toEqual(mockUser);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

  describe('findOneWithoutFail', () => {
    it('should return a single user or null', async () => {
      const user = await service.findOneWithoutFail({ email: 'test@example.com' });
      expect(user).toEqual(mockUser);
      expect(repository.findOneWithoutFail).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user = await service.create(mockUser);
      expect(user).toEqual(mockUser);
      expect(repository.create).toHaveBeenCalledWith(mockUser);
    });
  });
});
