import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    create(username: string, password: string): Promise<User>;
    findOne(username: string): Promise<User | undefined>;
    validateUser(username: string, password: string): Promise<User | null>;
}
