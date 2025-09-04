import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(username: string, password: string): Promise<import("./schemas/user.schema").User>;
}
