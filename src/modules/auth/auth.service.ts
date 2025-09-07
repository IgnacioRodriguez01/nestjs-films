import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { RegisterDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { plainToInstance } from 'class-transformer';
import { User, UserDocument } from '../users/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}
    
    async register(registerDto: RegisterDto, role: Role = Role.USER) {
        const user = await this.usersService.findOneWithoutFail({ email: registerDto.email });
        if (user) {
            throw new BadRequestException('User already exists');
        }
        const mappedUser = plainToInstance(User, registerDto);
        mappedUser.role = role;

        const salt = await bcrypt.genSalt(10);
        mappedUser.password = await bcrypt.hash(mappedUser.password, salt);
        
        const newUser = await this.usersService.create(mappedUser);
        return newUser;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user._id, role: user.role };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneOrFail({ email }) as UserDocument;
        const userPlain = user.toObject();

        if (user && await bcrypt.compare(pass, userPlain.password)) {
            const { password, ...result } = userPlain;
            return result;
        }
        throw new UnauthorizedException('Invalid credentials');
    }
}
