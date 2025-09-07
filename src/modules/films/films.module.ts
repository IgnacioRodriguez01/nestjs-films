import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmSchema, Film } from './schema/film.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsRepository } from './repository/films.repository';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as https from 'https';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('SWAPI_URL'),
      }),
    }),
  ],
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository]
})
export class FilmsModule {}
