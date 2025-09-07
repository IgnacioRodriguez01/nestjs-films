import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false })
export class FilmProperties {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  episode_id: number;

  @Prop()
  opening_crawl: string;

  @Prop()
  director: string;

  @Prop()
  producer: string;

  @Prop()
  release_date: Date;

  @Prop({ type: [String], default: [] })
  species: string[];

  @Prop({ type: [String], default: [] })
  starships: string[];

  @Prop({ type: [String], default: [] })
  vehicles: string[];

  @Prop({ type: [String], default: [] })
  characters: string[];

  @Prop({ type: [String], default: [] })
  planets: string[];

  @Prop({ required: false, default: null })
  url: string;

  @Prop({ required: false, default: null })
  created: Date;

  @Prop({ required: false, default: null })
  edited: Date;
}

export const FilmPropertiesSchema = SchemaFactory.createForClass(FilmProperties);

@Schema()
export class Film {
  _id: Types.ObjectId;

  @Prop({ default: "A Star Wars Film" })
  description: string;

  @Prop({ type: FilmPropertiesSchema, required: true })
  properties: FilmProperties;
}

export type FilmDocument = HydratedDocument<Film>;

export const FilmSchema = SchemaFactory.createForClass(Film);
