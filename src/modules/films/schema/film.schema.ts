import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false })
export class FilmProperties {
  @Prop()
  title: string;

  @Prop()
  episode_id: string;

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

  @Prop({ required: false, default: new Date() })
  created: Date;

  @Prop({ required: false, default: new Date() })
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

  @Prop({ unique: true, required: true })
  uid: string;
}

export type FilmDocument = HydratedDocument<Film>;

export const FilmSchema = SchemaFactory.createForClass(Film);
