import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema'; // Importa la clase Product
import { getModelToken } from '@nestjs/mongoose';

describe('ProductsService', () => {
  let service: ProductsService;
  let model: Model<Product>;

  beforeEach(async () => {
    const mockProduct = {
      title: 'Test Product',
      description: 'This is a test product',
      price: 100,
      stock: 10,
      image: 'https://via.placeholder.com/300x400?text=Sin+Imagen',
      category: 'remeras',
      save: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: {
            find: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([mockProduct]), // Simula una lista de productos
            create: jest.fn().mockResolvedValue(mockProduct), // Simula la creación de un producto
            findById: jest.fn().mockResolvedValue(mockProduct), // Simula la búsqueda por ID
            prototype: {
              ...mockProduct,
            }
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    model = module.get<Model<Product>>(getModelToken(Product.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all products', async () => {
    const result = await service.findAll(); // Suponiendo que tienes un método findAll
    expect(result).toHaveLength(1); // Verifica que se devuelva al menos un producto
  });

  it('should create a product', async () => {
    const newProduct = {
      title: 'New Product',
      description: 'This is a new product',
      price: 200,
      stock: 5,
      category: 'buzos',
    };
    const createdProduct = await service.create(newProduct); // Suponiendo que tienes un método create
    expect(createdProduct).toEqual(expect.objectContaining(newProduct));
  });
});