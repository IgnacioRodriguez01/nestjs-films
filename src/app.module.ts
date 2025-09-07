import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { FilmsModule } from './modules/films/films.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/validations/env.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI')
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    FilmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
