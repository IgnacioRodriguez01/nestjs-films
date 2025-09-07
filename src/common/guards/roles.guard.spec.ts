import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, NotFoundException } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

const mockExecutionContext = (user: any, roles: Role[] = []): ExecutionContext => ({
  switchToHttp: () => ({
    getRequest: () => ({ user }),
  }),
  getHandler: () => {},
  getClass: () => {},
} as any);

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if no roles are required', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = mockExecutionContext({ role: Role.USER });
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should return true if user has the required role', async () => {
    const requiredRoles = [Role.ADMIN];
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);
    const context = mockExecutionContext({ role: Role.ADMIN });
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should return false if user does not have the required role', async () => {
    const requiredRoles = [Role.ADMIN];
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);
    const context = mockExecutionContext({ role: Role.USER });
    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });

  it('should throw NotFoundException if user is not found', async () => {
    const requiredRoles = [Role.USER];
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);
    const context = mockExecutionContext(null);
    await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
  });
});
