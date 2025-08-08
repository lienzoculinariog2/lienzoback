import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './entities/product.entity';
import { Categories } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async create(dto: CreateProductDto): Promise<Products> {
    const category = await this.categoriesRepository.findOneBy({
      id: dto.categoryId,
    });
    if (!category) {
      throw new NotFoundException(`Categoría con ID ${dto.categoryId} no encontrada.`);
    }

    const existingProduct = await this.productsRepository.findOne({
      where: { name: dto.name },
    });
    if (existingProduct) {
      throw new ConflictException(`Ya existe un producto con el nombre "${dto.name}".`);
    }

    const product = this.productsRepository.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      caloricLevel: dto.caloricLevel,
      ingredients: dto.ingredients ?? [],
      isActive: dto.isActive ?? true,
      categoryId: category,
      imgUrl: dto.imgUrl,
    });

    return await this.productsRepository.save(product);
  }

  async findAll(page: number = 1, limit: number = 5) {
    let products = await this.productsRepository.find();
    if (!page || !limit) {
      return products;
    }
    const start = (page - 1) * limit;
    const end = start + +limit;
    products = products.slice(start, end);
    return products;
  }

  // Nuevo método para obtener un producto por su ID
  async getProductById(id: string): Promise<Products | null> {
    return await this.productsRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Products> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
