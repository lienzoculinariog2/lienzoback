import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import dataProducts from '../../data.Products.json';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Categories } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories) private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async seederService() {
    const categoriesNames = new Map();
    dataProducts.forEach((product) => {
      if (!categoriesNames.has(product.category.name)) {
        categoriesNames.set(product.category.name, product.category.description);
      }
    });

    const categoriesArray = Array.from(categoriesNames).map(([name, description]) => ({
      name,
      description,
    }));

    await this.categoriesRepository.upsert(categoriesArray, ['name']);

    return {
      message: 'Categories seeded successfully',
      count: categoriesArray.length,
      categories: categoriesArray,
    };
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException(`Category '${createCategoryDto.name}' already exists`);
    }
    const category = this.categoriesRepository.create({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
    });
    await this.categoriesRepository.save(category);
    return { message: 'Category successfully added', category };
  }

  async findAll(page: number, limit: number) {
    let categories: Categories[] = await this.categoriesRepository.find();
    const start = (page - 1) * limit;
    const end = start + limit;
    categories = categories.slice(start, end);
    return categories;
  }

  async findOne(id: string) {
    const categoryById = await this.categoriesRepository.findOne({
      where: { id },
    });
    if (!categoryById) {
      throw new NotFoundException(`Categoría con ${id} no existe`);
    }
    return categoryById;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.categoriesRepository.update(id, updateCategoryDto);
    const updatedCategory = await this.categoriesRepository.findOne({
      where: { id },
    });
    if (!updatedCategory) {
      throw new NotFoundException(`Categoría con id ${id} no existe`);
    }
    await this.categoriesRepository.update(id, updateCategoryDto);
    return { message: 'Category successfully updated', updatedCategory };
  }

  // remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}
