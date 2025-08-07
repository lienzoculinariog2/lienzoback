import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './entities/product.entity';
import { Categories } from '../categories/entities/category.entity';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';

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

  async findAll(filterDto: GetProductsFilterDto): Promise<Products[]> {
    const { 
      name, 
      price_min, 
      price_max, 
      isActive, 
      categoryId, 
      sortBy, 
      order = 'asc' 
    } = filterDto;

    const query = this.productsRepository.createQueryBuilder('product');

    if (categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (name) {
      query.andWhere('product.name ILIKE :name', { name: `%${name}%` });
    }

    if (price_min) {
      query.andWhere('product.price >= :price_min', { price_min });
    }

    if (price_max) {
      query.andWhere('product.price <= :price_max', { price_max });
    }

    if (isActive !== undefined) {
      query.andWhere('product.isActive = :isActive', { isActive });
    }

    
    if (sortBy) {
      const orderDirection = order.toUpperCase() as 'ASC' | 'DESC';
      query.orderBy(`product.${sortBy}`, orderDirection);
    }

    
    return await query.getMany();
  }

  
  async getProductById(id: string): Promise<Products | null> {
    return this.productsRepository.findOneBy({ id });
  }

  async updateProductImage(productId: string, secureUrl: string) {
    
    const product = await this.productsRepository.findOneBy({ id: productId });
    
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }

    product.imgUrl = secureUrl;

    await this.productsRepository.save(product);

    return product; 
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