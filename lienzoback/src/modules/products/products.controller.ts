import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() product: CreateProductDto) {
    return this.productsService.create(product);
  }

  @Get()
  findAll(@Query('page') page: 1, @Query('limit') limit: 5) {
    return this.productsService.findAll(+page, +limit);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getProductById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() product: Partial<Products>) {
    return this.productsService.update(id, product);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
