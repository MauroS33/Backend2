import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema'; // Importa la clase User
import { getModelToken } from '@nestjs/mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  beforeEach(async () => {
    const mockUser = {
      username: 'testuser',
      password: 'password123',
      role: 'user',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            // Mock de métodos de Mongoose
            findOne: jest.fn().mockResolvedValue(mockUser), // Simula la búsqueda de un usuario
            create: jest.fn().mockResolvedValue(mockUser), // Simula la creación de un usuario
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
    expect(createdUser).toEqual(expect.objectContaining(newUser));
  });
});