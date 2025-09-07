import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { FilmsModule } from './modules/films/films.module';
import { DatabaseModule } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/validations/env.validation';

@Module({
  imports: [
    UsersModule,
    FilmsModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
