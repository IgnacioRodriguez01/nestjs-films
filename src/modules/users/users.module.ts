import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './repository/users.repository';
import { UserSchema, User } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService, UsersRepository],
  exports: [UsersService]
})
export class UsersModule {}
