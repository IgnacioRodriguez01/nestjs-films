import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Role } from "src/common/enums/role.enum";

@Schema()
export class User {
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;
    
    @Prop({ unique: true, required: true })
    email: string;
    
    @Prop({ required: true })
    password: string;
    
    @Prop({ required: true, default: Role.USER })
    role: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

