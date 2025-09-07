import { Model, Document } from "mongoose";
import { NotFoundException } from "@nestjs/common";
import { FilterQuery, UpdateQuery } from "mongoose";
import { Types } from "mongoose";

export abstract class EntityRepository<T extends Document> {
    constructor(private readonly entityModel: Model<T>) {}

    async findAll(filter: FilterQuery<T>, projection: Record<string, unknown> = { __v: 0 }): Promise<T[]> {
        return this.entityModel.find(filter, projection).exec();
    }

    async findByIdOrFail(id: Types.ObjectId, projection: Record<string, unknown> = { __v: 0 }): Promise<T> {
        const entity = await this.entityModel.findById(id, projection).exec();
        if (!entity) {
            throw new NotFoundException(`Entity not found`);
        }
        return entity;
    }
    
    async findOneOrFail(filter: FilterQuery<T>, projection: Record<string, unknown> = { __v: 0 }): Promise<T> {
        const entity = await this.entityModel.findOne(filter, projection).exec();
        if (!entity) {
            throw new NotFoundException(`Entity not found`);
        }
        return entity;
    }

    async findOneWithoutFail(filter: FilterQuery<T>, projection: Record<string, unknown> = { __v: 0 }): Promise<T | null> {
        return await this.entityModel.findOne(filter, projection).exec();
    }

    async updateOrFail(filter: FilterQuery<T>, update: UpdateQuery<unknown>): Promise<T> {
        const entity = await this.entityModel.findOneAndUpdate(filter, update, { new: true }).exec();
        if (!entity) {
            throw new NotFoundException(`Entity not found`);
        }
        return entity;
    }

    async updateOrCreate(filter: FilterQuery<T>, update: UpdateQuery<unknown>): Promise<T> {
        const entity = await this.entityModel.findOneAndUpdate(filter, update, { new: true, upsert: true }).exec();
        return entity;
    }

    async create(entity: unknown): Promise<T> {
        const createdEntity = new this.entityModel(entity);
        return createdEntity.save();
    }

    async findOrCreate(filter: FilterQuery<T>, projection?: Record<string, unknown>): Promise<T> {
        const data = await this.entityModel.findOne(filter, { __v: 0, ...projection }).exec()
    
        if (!data) {
          const entity = new this.entityModel(filter)
    
          return (await entity.save())
        }
        return data
      }

    async deleteOrFail(id: Types.ObjectId): Promise<T> {
        const entity = await this.entityModel.findByIdAndDelete(id).exec();
        if (!entity) {
            throw new NotFoundException(`Entity not found`);
        }
        return entity;
    }
}