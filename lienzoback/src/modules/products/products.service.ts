import { Injectable, NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException('Categoría no encontrada');
    }
    const product = this.productsRepository.create();
    product.name = dto.name;
    product.description = dto.description;
    product.price = dto.price;
    product.stock = dto.stock;
    product.caloricLevel = dto.caloricLevel;
    product.categoryId = category;
    product.imgUrl = dto.imgUrl || null;
    product.isActive = dto.isActive ?? true;
    product.ingredients = dto.ingredients ?? [];
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
    return this.productsRepository.findOneBy({ id });
  }

  // Nuevo método para actualizar un producto
    async updateProductImage(productId: string, secureUrl: string) {
    // 1. Busca el producto por su ID
    const product = await this.productsRepository.findOneBy({ id: productId });
    
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }

    // 2. Actualiza la URL de la imagen
    product.imgUrl = secureUrl;

    // 3. Guarda los cambios en la base de datos
    await this.productsRepository.save(product);

    return product; // Devuelve el producto con la URL actualizada
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }
  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }
  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}