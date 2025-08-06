// src/products/entities/product.entity.ts
import { Categories } from 'src/modules/categories/entities/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column({
    type: 'text',
    default: 'No image',
  })
  imgUrl?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: true })
  caloricLevel: number;

  @ManyToOne(() => Categories, (category) => category.product)
  @JoinColumn({ name: 'category_id' })
  categoryId: Categories;
}
