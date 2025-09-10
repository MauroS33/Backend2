import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema'; 
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  beforeEach(async () => {
    const mockUser = {
      username: 'testuser',
      password: 'password123',
      role: 'user',
      save: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
            exec: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockResolvedValue(mockUser),
            prototype: {
              ...mockUser,
            }
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a user by username', async () => {
    const result = await service.findByUsername('testuser');
    expect(result.username).toBe('testuser');
  });

  it('should create a user', async () => {
    const newUser = {
      username: 'newuser',
      password: 'password456',
    };
    const createdUser = await service.create(newUser.username, newUser.password);
    expect(createdUser).toEqual(expect.objectContaining({ username: newUser.username }));  });
});