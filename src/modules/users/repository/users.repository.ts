import { Model } from "mongoose";
import { UserDocument } from "../schema/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { EntityRepository } from "src/common/database/entity.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository extends EntityRepository<UserDocument> {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<UserDocument>,
    ) {
        super(userModel)
    }
}   